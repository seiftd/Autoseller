import { Job, WebhookEvent } from '../types';
import { geminiService } from './geminiService';
import { facebookService } from './facebookService';
import { storageService } from './storageService';
import { webhookService } from './webhookService'; // For updating event status

// Rate Limiting Cache (In-Memory for this demo)
const rateLimits: Record<string, { count: number, windowStart: number }> = {};
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

export const workerService = {
  
  processWebhookJob: async (job: Job) => {
    const event = job.payload as WebhookEvent;
    
    // 1. Idempotency Check (Double Check)
    const existingEvent = storageService.findWebhookEventByPlatformId(event.platformEventId);
    if (existingEvent && existingEvent.status === 'processed') {
      console.log(`[Worker] Event ${event.platformEventId} already processed. Skipping.`);
      return;
    }

    // Process Payload Entry
    // Note: The queue sends the whole event wrapper, but inside we need the specific entry payload
    const payload = event.payload;

    // We assume payload is a single entry change here for simplicity,
    // as the webhookService splits multiple entries into separate jobs.
    if (!payload || !payload.changes) return;

    for (const change of payload.changes) {
         if (change.field === 'feed' && change.value.item === 'comment') {
             await workerService.handleComment(change.value, event.platformEventId);
         }
    }

    // 2. Mark Webhook Event as Processed
    event.status = 'processed';
    storageService.saveWebhookEvent(event);
  },

  handleComment: async (commentData: any, eventId: string) => {
      const { message, sender_name, comment_id, post_id } = commentData;
      
      // 3. Loop Prevention
      // Find account to check if sender is US (the page)
      // Since we don't have page_id in comment payload easily, we assume the webhook source matches
      // In production, we'd check if sender_id matches the connected page_id
      const accounts = storageService.getAccounts();
      const isSelf = accounts.some(a => a.name === sender_name); // Simplified check
      
      if (isSelf) {
          console.log("[Worker] Loop Prevention: Ignoring own comment.");
          return;
      }

      // 4. Rate Limiting
      if (workerService.isRateLimited(sender_name)) {
          console.warn(`[Worker] Rate Limit Exceeded for ${sender_name}`);
          return;
      }

      console.log(`[Worker] Processing Comment from ${sender_name}: "${message}"`);

      // 5. Business Logic (Gemini)
      const replyText = await geminiService.processMessage(message, 'comment');

      // 6. External API Call
      // We need to find which account this belongs to. 
      // For this demo, we pick the first connected FB account. 
      // In prod, pass page_id in job payload.
      const account = accounts.find(a => a.platform === 'Facebook' && a.connected);
      
      if (!account || !account.accessToken) {
          throw new Error("No connected Facebook account found to reply.");
      }

      await facebookService.replyToComment(comment_id, replyText, account.accessToken);
      console.log(`[Worker] Sent Reply to ${comment_id}`);
  },

  isRateLimited: (senderId: string): boolean => {
      const now = Date.now();
      const record = rateLimits[senderId] || { count: 0, windowStart: now };
      
      if (now - record.windowStart > RATE_LIMIT_WINDOW) {
          // Reset window
          record.count = 1;
          record.windowStart = now;
      } else {
          record.count++;
      }

      rateLimits[senderId] = record;
      return record.count > MAX_REQUESTS_PER_WINDOW;
  }
};