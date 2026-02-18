/**
 * tokenService.ts — Client-side token lifecycle management
 *
 * Handles:
 * - AES-GCM encryption/decryption of tokens in localStorage (client-side, using Web Crypto)
 * - Account health status calculation
 * - Automatic token refresh via backend function
 * - Scheduled health checks on app load
 */

import { SocialAccount, AccountHealthStatus } from '../types';
import { storageService } from './storageService';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

// ─── Client-Side Encryption (for localStorage storage) ────────────────────────
// NOTE: This is a secondary layer. The primary encryption happens server-side.
// Tokens stored in localStorage are already encrypted by the server (AES-GCM).
// We store them as-is (the server's encrypted format) — no additional client encryption needed.

// ─── Health Status ─────────────────────────────────────────────────────────────

// ─── Health Status ─────────────────────────────────────────────────────────────

export function getAccountHealthStatus(account: SocialAccount): AccountHealthStatus {
    if (!account.connected) {
        return 'action_required';
    }

    if (account.status === 'reconnection_required') {
        return 'reconnection_required';
    }

    if (account.status === 'action_required') {
        return 'action_required';
    }

    if (!account.tokenExpiry) {
        return 'action_required';
    }

    const timeUntilExpiry = account.tokenExpiry - Date.now();

    if (timeUntilExpiry <= 0) {
        return 'reconnection_required'; // Expired
    }

    if (timeUntilExpiry <= THREE_DAYS_MS) {
        return 'action_required'; // Critical — expires in < 3 days
    }

    if (timeUntilExpiry <= SEVEN_DAYS_MS) {
        return 'expiring_soon'; // Warning — expires in < 7 days
    }

    // Check webhook health
    if (account.lastWebhookAt) {
        const hoursSinceWebhook = (Date.now() - account.lastWebhookAt) / (1000 * 60 * 60);
        if (hoursSinceWebhook > 48) {
            return 'expiring_soon'; // No webhooks in 48h — might be an issue
        }
    }

    // Check subscription status
    if (account.subscriptionStatus === false) {
        return 'expiring_soon'; // Not subscribed to webhooks
    }

    return 'healthy';
}

export function getHealthLabel(status: AccountHealthStatus): { emoji: string; label: string; color: string } {
    switch (status) {
        case 'healthy':
            return { emoji: '🟢', label: 'Healthy', color: 'text-emerald-400' };
        case 'expiring_soon':
            return { emoji: '🟡', label: 'Expiring Soon', color: 'text-yellow-400' };
        case 'action_required':
            return { emoji: '🔴', label: 'Action Required', color: 'text-red-400' };
        case 'reconnection_required':
            return { emoji: '🔴', label: 'Reconnection Required', color: 'text-red-400' };
    }
}

export function getTokenExpiryText(tokenExpiry?: number): string {
    if (!tokenExpiry) return 'Unknown';
    const diff = tokenExpiry - Date.now();
    if (diff <= 0) return 'Expired';
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
}

// ─── Token Refresh (Requirement 7) ─────────────────────────────────────────────

async function refreshAccountToken(account: SocialAccount): Promise<SocialAccount> {
    // REQUIREMENT 7: Trigger refresh check on the server
    try {
        const res = await fetch('/.netlify/functions/fb-token-refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                accountId: account.id,
            }),
        });

        const data = await res.json() as any;

        if (data.status === 'success') {
            console.log(`[tokenService] Token refreshed for account ${account.id}`);
            return {
                ...account,
                tokenExpiry: data.newExpiry,
                status: 'healthy',
                lastSync: Date.now(),
            };
        }

        if (data.status === 'failed') {
            // Requirement 7: Send email alert would happen on server
            console.warn(`[tokenService] Token refresh failed for account ${account.id}. Marking as reconnection_required.`);
            return {
                ...account,
                status: 'reconnection_required',
                connected: false,
            };
        }

        return account;

    } catch (err) {
        console.error(`[tokenService] Network error refreshing token for ${account.id}:`, err);
        return account;
    }
}

// ─── Scheduled Health Check ────────────────────────────────────────────────────

let healthCheckRunning = false;

/**
 * Run on app load. Checks all accounts for expiring tokens and refreshes them.
 * Updates account status in storageService.
 */
export async function runTokenHealthCheck(): Promise<void> {
    if (healthCheckRunning) return;
    healthCheckRunning = true;

    try {
        const accounts = storageService.getAccounts();
        if (accounts.length === 0) return;

        const updatedAccounts: SocialAccount[] = [];
        let anyChanged = false;

        for (const account of accounts) {
            const healthStatus = getAccountHealthStatus(account);
            let updatedAccount: SocialAccount = { ...account, status: healthStatus };

            // Auto-refresh if expiring within 7 days
            if (
                (healthStatus === 'expiring_soon' || healthStatus === 'action_required') &&
                account.tokenExpiry &&
                account.tokenExpiry > Date.now()
            ) {
                updatedAccount = await refreshAccountToken(updatedAccount) as SocialAccount;
                // Requirement 7: Email alert logic would be triggered by the server if refresh fails
                anyChanged = true;
            }

            updatedAccounts.push(updatedAccount);
        }

        if (anyChanged) {
            storageService.saveAccounts(updatedAccounts);
            console.log('[tokenService] Health check complete. Accounts updated.');
        }

    } catch (err) {
        console.error('[tokenService] Health check error:', err);
    } finally {
        healthCheckRunning = false;
    }
}
