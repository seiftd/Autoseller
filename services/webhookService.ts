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
     * Get the webhook configuration info for display in the UI.
     * Users need this to configure their Meta App webhook settings.
     */
    getWebhookConfig: () => ({
        callbackUrl: facebookService.getWebhookUrl(),
        verifyToken: facebookService.getWebhookVerifyToken(),
        subscribedFields: ['feed', 'messages', 'mention'],
    }),

    /**
     * Update the last webhook timestamp for an account (called when webhook processed).
     */
    updateAccountWebhookTimestamp: (pageId: string): void => {
        const accounts = storageService.getAccounts();
        const updated = accounts.map(a =>
            a.pageId === pageId ? { ...a, lastWebhookAt: Date.now() } : a
        );
        storageService.saveAccounts(updated);
    },
};
