
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { db } from './utils/db';
import { createDecipheriv, scryptSync } from 'crypto';

const FB_API_VERSION = 'v19.0';
const FB_GRAPH = `https://graph.facebook.com/${FB_API_VERSION}`;

function getEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing environment variable: ${key}`);
    return val;
}

/** AES-GCM decryption using Node.js crypto (server-side only) */
async function decryptToken(encrypted: string): Promise<string> {
    const [ivHex, authTagHex, ciphertextHex] = encrypted.split(':');
    const key = scryptSync(getEnv('ENCRYPTION_KEY'), 'salt', 32);
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const ciphertext = Buffer.from(ciphertextHex, 'hex');

    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return decrypted.toString('utf8');
}

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
    const headers = {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
    if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: 'Method not allowed' };

    try {
        const { accountId, content, platform } = JSON.parse(event.body || '{}');

        if (!accountId) throw new Error('accountId is required');

        // 1. Get encrypted token from DB (Requirement 8)
        const account = await db.getAccount(accountId);
        if (!account) throw new Error('Account not found');

        // Check if token is expired (Requirement 7)
        if (account.tokenExpiry && Date.now() > account.tokenExpiry) {
            throw new Error('TOKEN_EXPIRED: Please reconnect your account.');
        }

        // 2. Decrypt ONLY inside serverless function (Requirement 8)
        const token = await decryptToken(account.encryptedToken);

        // 3. Call Facebook API (Requirement 2: Use page_access_token)
        const url = platform === 'instagram'
            ? `${FB_GRAPH}/${account.instagramId}/media` // Simplification
            : `${FB_GRAPH}/${account.pageId}/feed`;

        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: content,
                access_token: token
            })
        });

        const data = await res.json() as any;
        if (data.error) throw new Error(data.error.message);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, result: data }),
        };

    } catch (err: any) {
        console.error('[fb-publish] Error:', err.message);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
