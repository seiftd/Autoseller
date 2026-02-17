import { geminiService } from './geminiService';
import { facebookService } from './facebookService';
import { storageService } from './storageService';
import { cryptoService } from './cryptoService';
import { queueService } from './queueService';
import { WebhookEvent } from '../types';

// Types for Webhook Payloads
interface WebhookEntry {
  id: string; // Page ID
  time: number;
  changes?: Array<{
    field: string;
    value: {
      item: 'comment' | 'post';
      comment_id: string;
      message: string;
      sender_name: string;
      post_id: string;
      parent_id?: string;
    };
  }>;
  messaging?: Array<{
    sender: { id: string };
    recipient: { id: string };
    message: { text: string };
  }>;
}

interface WebhookPayload {
  object: 'page' | 'instagram';
  entry: WebhookEntry[];
}

export const webhookService = {
  // Production-grade Webhook Handler
  handleIncomingWebhook: async (rawBody: string, signature: string): Promise<{status: number, message: string}> => {
      // 1. Security: Verify Signature
      // In a real app, 'APP_SECRET' would be in env vars
      const APP_SECRET = localStorage.getItem('fb_app_secret') || 'default_secret'; 
      const isValid = await cryptoService.verifySignature(rawBody, signature, APP_SECRET);
      
      if (!isValid) {
          storageService.logError({
              id: crypto.randomUUID(),
              type: 'security',
              severity: 'critical',
              message: 'Invalid Webhook Signature Detected',
              timestamp: Date.now(),
              metadata: { signature }
          });
          return { status: 403, message: 'Invalid Signature' };
      }

      const payload: WebhookPayload = JSON.parse(rawBody);

      // 2. Process Entries
      for (const entry of payload.entry) {
          // Handle Idempotency & Queueing for Feed Changes
          if (entry.changes) {
              for (const change of entry.changes) {
                  // Generate a deterministic ID for idempotency
                  // For comments: comment_id is unique
                  const platformEventId = change.value.comment_id || `${entry.id}_${entry.time}`;
                  
                  // Check if exists
                  const existing = storageService.findWebhookEventByPlatformId(platformEventId);
                  if (existing) {
                      console.log(`[Webhook] Duplicate event ${platformEventId} ignored.`);
                      continue;
                  }

                  // Create Event Record
                  const event: WebhookEvent = {
                      id: crypto.randomUUID(),
                      platformEventId,
                      platform: payload.object === 'instagram' ? 'Instagram' : 'Facebook',
                      payload: { changes: [change] }, // Isolate the specific change
                      receivedAt: Date.now(),
                      status: 'pending',
                      retryCount: 0
                  };
                  
                  storageService.saveWebhookEvent(event);

                  // Push to Queue (Async Processing)
                  queueService.addJob('process_webhook', event);
              }
          }
      }

      // 3. Return 200 Immediately
      return { status: 200, message: 'Event Received' };
  },

  // Simulate a test event (Updated to use new pipeline)
  simulateTestComment: async (pageId: string) => {
      const payload = {
          object: 'page',
          entry: [{
              id: pageId,
              time: Date.now(),
              changes: [{
                  field: 'feed',
                  value: {
                      item: 'comment',
                      comment_id: `TEST_COMMENT_${Date.now()}`, // Unique ID for testing
                      message: 'How much is shipping to Algiers?',
                      sender_name: 'Test User',
                      post_id: 'POST_ID'
                  }
              }]
          }]
      };

      const rawBody = JSON.stringify(payload);
      // For simulation, we create a valid signature using the known mock secret
      const secret = localStorage.getItem('fb_app_secret') || 'default_secret';
      
      // We need to compute signature manually here to pass verification
      const enc = new TextEncoder();
      const key = await window.crypto.subtle.importKey(
          "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
      );
      const sigBuf = await window.crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
      const sigHex = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
      
      console.log("--- SIMULATING INCOMING WEBHOOK ---");
      const result = await webhookService.handleIncomingWebhook(rawBody, `sha256=${sigHex}`);
      console.log("Webhook Result:", result);
      
      if (result.status === 200) {
          alert("Webhook Event Queued! Check System Health tab in Settings.");
      } else {
          alert(`Webhook Failed: ${result.message}`);
      }
  }
};