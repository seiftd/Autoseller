/**
 * webhookService.ts — Client-side webhook simulation & event management
 *
 * In production:
 * - Real webhooks arrive at /.netlify/functions/fb-webhook (server-side)
 * - Signature verification happens server-side with FB_APP_SECRET
 * - This service handles client-side simulation and event display only
 *
 * SECURITY: App Secret is NEVER used client-side. Removed from localStorage.
 */

import { geminiService } from './geminiService';
import { facebookService } from './facebookService';
import { storageService } from './storageService';
import { queueService } from './queueService';
import { WebhookEvent } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WebhookChange {
    field: string;
    value: {
        item: 'comment' | 'post';
        comment_id: string;
        message: string;
        sender_name: string;
        post_id: string;
        parent_id?: string;
    };
}

interface WebhookEntry {
    id: string;
    time: number;
    changes?: WebhookChange[];
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

// ─── Service ──────────────────────────────────────────────────────────────────

export const webhookService = {

    /**
     * Process an incoming webhook payload.
     * In production this runs server-side in fb-webhook.ts.
     * This client-side version is used for simulation/testing only.
     *
     * NOTE: Signature verification is intentionally NOT done here —
     * it requires the App Secret which must stay server-side.
     */
    handleIncomingWebhook: async (payload: WebhookPayload): Promise<{ status: number; message: string }> => {
        for (const entry of payload.entry) {
            if (entry.changes) {
                for (const change of entry.changes) {
                    const platformEventId = change.value.comment_id || `${entry.id}_${entry.time}`;

                    // Idempotency check
                    const existing = storageService.findWebhookEventByPlatformId(platformEventId);
                    if (existing) {
                        console.log(`[Webhook] Duplicate event ${platformEventId} ignored.`);
                        continue;
                    }

                    const event: WebhookEvent = {
                        id: crypto.randomUUID(),
                        platformEventId,
                        platform: payload.object === 'instagram' ? 'Instagram' : 'Facebook',
                        payload: { changes: [change] },
                        receivedAt: Date.now(),
                        status: 'pending',
                        retryCount: 0,
                    };

                    storageService.saveWebhookEvent(event);
                    queueService.addJob('process_webhook', event);
                }
            }
        }

        return { status: 200, message: 'Event Received' };
    },

    /**
     * Simulate a test comment webhook event for development/testing.
     * Uses a locally-computed HMAC for simulation only (no App Secret exposed).
     */
    simulateTestComment: async (pageId: string): Promise<void> => {
        const payload: WebhookPayload = {
            object: 'page',
            entry: [{
                id: pageId,
                time: Date.now(),
                changes: [{
                    field: 'feed',
                    value: {
                        item: 'comment',
                        comment_id: `TEST_COMMENT_${Date.now()}`,
                        message: 'How much is shipping to Algiers?',
                        sender_name: 'Test User',
                        post_id: 'POST_ID',
                    },
                }],
            }],
        };

        console.log('--- SIMULATING INCOMING WEBHOOK (client-side, no signature) ---');
        const result = await webhookService.handleIncomingWebhook(payload);
        console.log('Webhook Result:', result);

        if (result.status === 200) {
            alert('Webhook Event Queued! Check System Health tab in Settings.');
        } else {
            alert(`Webhook Failed: ${result.message}`);
        }
    },

    /**
     * Get the webhook configuration info for display in the UI.
     * Users need this to configure their Meta App webhook settings.
     */
    getWebhookConfig: () => ({
        callbackUrl: facebookService.getWebhookUrl(),
        verifyToken: facebookService.getWebhookVerifyToken(),
        subscribedFields: ['feed', 'messages', 'mention'],
    }),

    /**
     * Update the last webhook timestamp for an account (called when webhook received).
     */
    updateAccountWebhookTimestamp: (pageId: string): void => {
        const accounts = storageService.getAccounts();
        const updated = accounts.map(a =>
            a.pageId === pageId ? { ...a, lastWebhookAt: Date.now() } : a
        );
        storageService.saveAccounts(updated);
    },
};