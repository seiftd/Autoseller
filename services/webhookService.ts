import { geminiService } from './geminiService';
import { facebookService } from './facebookService';
import { storageService } from './storageService';

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
  // This simulates receiving a webhook event from a real backend
  // In a real app, this runs on Node.js/Express
  processPayload: async (payload: WebhookPayload) => {
    console.log("Processing Webhook Payload:", payload);

    for (const entry of payload.entry) {
      const pageId = entry.id;
      const account = storageService.getAccounts().find(a => a.pageId === pageId || a.instagramId === pageId);
      
      if (!account || !account.accessToken) {
        console.error(`No connected account found for ID ${pageId}`);
        continue;
      }

      // Handle Feed Changes (Comments)
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'feed' && change.value.item === 'comment' && change.value.message) {
             const userMessage = change.value.message;
             const commentId = change.value.comment_id;
             const sender = change.value.sender_name;

             // Ignore own comments
             if (sender === account.name) continue;

             console.log(`Received Comment from ${sender}: ${userMessage}`);

             // 1. Analyze with Gemini
             const replyText = await geminiService.processMessage(userMessage, 'comment');
             
             // 2. Post Reply via Graph API
             try {
                 await facebookService.replyToComment(commentId, replyText, account.accessToken);
                 console.log(`Auto-replied to comment ${commentId}`);
                 
                 // Log to stats
                 const stats = storageService.getStats();
                 stats.messagesProcessed++;
                 // In real app, we'd save stats
             } catch (error) {
                 console.error("Failed to reply to comment via API:", error);
             }
          }
        }
      }
    }
  },

  // Helper to simulate a test event for user testing
  simulateTestComment: async (pageId: string) => {
      // Create a fake payload
      const payload: WebhookPayload = {
          object: 'page',
          entry: [{
              id: pageId,
              time: Date.now(),
              changes: [{
                  field: 'feed',
                  value: {
                      item: 'comment',
                      comment_id: 'TEST_COMMENT_ID', // This will fail real API call but shows logic flow
                      message: 'How much is shipping to Algiers?',
                      sender_name: 'Test User',
                      post_id: 'POST_ID'
                  }
              }]
          }]
      };
      
      // In simulation mode, we might want to skip the REAL API call if ID is fake, 
      // but let's run it to see the error in console or mock the reply function for this specific ID.
      if (payload.entry[0].changes![0].value.comment_id === 'TEST_COMMENT_ID') {
          console.log("--- SIMULATION START ---");
          const reply = await geminiService.processMessage('How much is shipping to Algiers?', 'comment');
          console.log("AI Generated Reply:", reply);
          console.log("Action: Would call FB API /TEST_COMMENT_ID/replies");
          alert(`Simulation Result:\n\nInput: "How much is shipping to Algiers?"\n\nAI Reply: "${reply}"\n\n(API call skipped for test ID)`);
          return;
      }

      await webhookService.processPayload(payload);
  }
};