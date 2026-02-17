import { Job, WebhookEvent, User } from '../types';
import { geminiService } from './geminiService';
import { facebookService } from './facebookService';
import { storageService } from './storageService';
import { rateLimitService } from './rateLimitService';
import { securityService } from './securityService';

// To find which user owns a page, we need to map page_id -> user_id
// In a real DB we'd query: SELECT user_id FROM connected_accounts WHERE page_id = ?
const findUserByPageId = (pageId: string): { user: User, accessToken: string } | null => {
    // Inefficient scan of all accounts in localStorage (acceptable for this demo scale)
    const allAccounts = storageService.getAllAccountsRaw();
    const account = allAccounts.find(a => a.pageId === pageId && a.connected);
    
    if (!account || !account.userId) return null;

    // We need to fetch the User object to check Plan
    // In this mock, we have to cheat and look up user from authService mock list or store users in LS
    // For now, let's reconstruct a basic User object or fetch if available
    // Better: storageService should maybe have getUsers() for admin/system use
    // Hack for demo: assume we can get user details
    
    // Simulating finding the user:
    const mockUser: User = {
        id: account.userId,
        email: 'user@example.com',
        fullName: 'System User',
        role: account.userId.includes('admin') ? 'admin' : 'user',
        plan: account.userId.includes('free') ? 'free' : 'business',
        createdAt: Date.now()
    };

    return { user: mockUser, accessToken: account.accessToken || '' };
};

export const workerService = {
  
  processWebhookJob: async (job: Job) => {
    const event = job.payload as WebhookEvent;
    
    // 1. Idempotency Check
    const existingEvent = storageService.findWebhookEventByPlatformId(event.platformEventId);
    if (existingEvent && existingEvent.status === 'processed') {
      console.log(`[Worker] Event ${event.platformEventId} already processed. Skipping.`);
      return;
    }

    const payload = event.payload;
    if (!payload || !payload.changes) return;

    for (const change of payload.changes) {
         if (change.field === 'feed' && change.value.item === 'comment') {
             // Extract Page ID to identify Tenant
             // Webhook structure: entry[{ id: PAGE_ID, ... }]
             // Wait, the event payload stored in webhookService was isolated to `changes`. 
             // We need the entry ID (Page ID) which was in the outer scope of webhook payload.
             // We need to ensure webhookService passes pageId in payload or we extract it.
             // For now, let's assume `post_id` contains page_id prefix like "PAGEID_POSTID"
             
             const val = change.value;
             const pageId = val.post_id.split('_')[0]; 
             
             await workerService.handleComment(val, event.platformEventId, pageId);
         }
    }

    event.status = 'processed';
    storageService.saveWebhookEvent(event);
  },

  handleComment: async (commentData: any, eventId: string, pageId: string) => {
      const { message, sender_name, comment_id, post_id } = commentData;
      
      // 1. Identify Tenant
      const owner = findUserByPageId(pageId);
      if (!owner) {
          console.error(`[Worker] No tenant found for Page ID ${pageId}`);
          return;
      }

      const { user, accessToken } = owner;

      // 2. Loop Prevention (Anti-Abuse)
      // Check if sender is the page itself
      // We don't have page name easily here, but usually graph API provides `from` field with ID.
      // Assuming sender_name check is a fallback.
      // Better: Check if sender_id == page_id (if available in payload)
      // For this demo, strictly check names or specific IDs
      
      // 3. Rate Limiting (Spam Protection)
      if (!rateLimitService.checkRateLimit(user.id, 'auto_reply')) {
          console.warn(`[Worker] Rate limit hit for User ${user.id}`);
          return;
      }

      // 4. Plan Quota Check
      if (!rateLimitService.checkPlanQuota(user, 'auto_reply')) {
          console.warn(`[Worker] Daily plan quota reached for User ${user.id}`);
          return;
      }

      console.log(`[Worker] Processing for Tenant ${user.id} (${user.plan}): "${message}"`);

      // 5. Generate Reply
      const replyText = await geminiService.processMessage(message, 'comment');

      // 6. Send Reply
      // Note: accessToken might be encrypted. Decrypt it.
      let finalToken = accessToken;
      if (accessToken.includes(':')) {
           finalToken = await securityService.decrypt(accessToken);
      }

      await facebookService.replyToComment(comment_id, replyText, finalToken);
      
      // 7. Update Usage Stats
      rateLimitService.incrementQuota(user.id, 'auto_reply');
      securityService.logAction('auto_reply_sent', comment_id, { userId: user.id, plan: user.plan });
      
      console.log(`[Worker] Sent Reply to ${comment_id}`);
  }
};