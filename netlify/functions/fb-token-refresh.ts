/**
 * fb-token-refresh — Scheduled Netlify Function (runs daily)
 *
 * Configured in netlify.toml as a scheduled function.
 * Iterates all connected accounts, refreshes tokens expiring within 7 days.
 *
 * NOTE: In this frontend-only architecture, accounts are stored in the user's
 * localStorage. This function serves as the server-side refresh endpoint that
 * the frontend calls on load (via tokenService.ts) when it detects expiring tokens.
 *
 * For a full backend, this would query a database and refresh all accounts.
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { createDecipheriv, scryptSync, createCipheriv, randomBytes } from 'crypto';

const FB_API_VERSION = 'v19.0';
const FB_GRAPH = `https://graph.facebook.com/${FB_API_VERSION}`;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// ─── Crypto Helpers ───────────────────────────────────────────────────────────

function getKey(): Buffer {
    return scryptSync(process.env.ENCRYPTION_KEY || '', 'salt', 32) as Buffer;
}

export function decryptToken(encrypted: string): string {
    const [ivHex, authTagHex, ciphertextHex] = encrypted.split(':');
    const key = getKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}

export function encryptToken(plaintext: string): string {
    const key = getKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

// ─── Token Refresh Logic ──────────────────────────────────────────────────────

async function refreshLongLivedToken(encryptedToken: string): Promise<{
    newEncryptedToken: string;
    newExpiry: number;
} | null> {
    let plainToken: string;
    try {
        plainToken = decryptToken(encryptedToken);
    } catch (e) {
        console.error('[fb-token-refresh] Failed to decrypt token:', e);
        return null;
    }

    const appId = process.env.FB_APP_ID;
    const appSecret = process.env.FB_APP_SECRET;

    if (!appId || !appSecret) {
        throw new Error('Missing FB_APP_ID or FB_APP_SECRET');
    }

    // Long-lived tokens can be refreshed by re-exchanging them
    const url = new URL(`${FB_GRAPH}/oauth/access_token`);
    url.searchParams.set('grant_type', 'fb_exchange_token');
    url.searchParams.set('client_id', appId);
    url.searchParams.set('client_secret', appSecret);
    url.searchParams.set('fb_exchange_token', plainToken);

    const res = await fetch(url.toString());
    const data = await res.json() as any;

    if (data.error) {
        console.error('[fb-token-refresh] Refresh failed:', data.error.message);
        return null;
    }

    const newEncryptedToken = encryptToken(data.access_token);
    const newExpiry = Date.now() + (data.expires_in || 5183944) * 1000;

    return { newEncryptedToken, newExpiry };
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
    const headers = { 'Content-Type': 'application/json' };

    // This endpoint is called by the frontend tokenService when it detects
    // an account with token expiry < 7 days.
    // It can also be triggered as a scheduled function.

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    let body: { encryptedToken: string; accountId: string; tokenExpiry: number };
    try {
        body = JSON.parse(event.body || '{}');
    } catch {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
    }

    const { encryptedToken, accountId, tokenExpiry } = body;

    if (!encryptedToken || !accountId) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing required fields' }) };
    }

    // Only refresh if expiring within 7 days
    const timeUntilExpiry = tokenExpiry - Date.now();
    if (timeUntilExpiry > SEVEN_DAYS_MS) {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                status: 'skipped',
                message: 'Token not expiring soon, no refresh needed',
                accountId,
            }),
        };
    }

    console.log(`[fb-token-refresh] Refreshing token for account ${accountId}, expires in ${Math.round(timeUntilExpiry / 86400000)} days`);

    const result = await refreshLongLivedToken(encryptedToken);

    if (!result) {
        console.error(`[fb-token-refresh] Failed to refresh token for account ${accountId}`);
        return {
            statusCode: 200, // Return 200 so frontend can handle gracefully
            headers,
            body: JSON.stringify({
                status: 'failed',
                accountId,
                message: 'Token refresh failed. Account requires reconnection.',
            }),
        };
    }

    console.log(`[fb-token-refresh] Successfully refreshed token for account ${accountId}`);

    return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
            status: 'success',
            accountId,
            newEncryptedToken: result.newEncryptedToken,
            newExpiry: result.newExpiry,
        }),
    };
};
