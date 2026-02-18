import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const FB_API_VERSION = 'v19.0';
const FB_GRAPH = `https://graph.facebook.com/${FB_API_VERSION}`;

// ─── Helpers ────────────────────────────────────────────────────────────────

function getEnv(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing environment variable: ${key}`);
    return val;
}

/** AES-GCM encryption using Node.js crypto (server-side only) */
async function encryptToken(plaintext: string): Promise<string> {
    const { createCipheriv, randomBytes, scryptSync } = await import('crypto');
    const key = scryptSync(getEnv('ENCRYPTION_KEY'), 'salt', 32);
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    // Format: iv:authTag:ciphertext (all hex)
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

/** Exchange short-lived token for long-lived (60-day) token */
async function exchangeForLongLivedToken(shortToken: string): Promise<{ token: string; expiresIn: number }> {
    const appId = getEnv('FB_APP_ID');
    const appSecret = getEnv('FB_APP_SECRET');

    const url = new URL(`${FB_GRAPH}/oauth/access_token`);
    url.searchParams.set('grant_type', 'fb_exchange_token');
    url.searchParams.set('client_id', appId);
    url.searchParams.set('client_secret', appSecret);
    url.searchParams.set('fb_exchange_token', shortToken);

    const res = await fetch(url.toString());
    const data = await res.json() as any;

    if (data.error) {
        throw new Error(`Token exchange failed: ${data.error.message}`);
    }

    return {
        token: data.access_token,
        expiresIn: data.expires_in || 5183944, // ~60 days default
    };
}

/** Fetch all pages the user manages, with IG business account info */
async function fetchUserPages(longLivedToken: string): Promise<any[]> {
    const url = new URL(`${FB_GRAPH}/me/accounts`);
    url.searchParams.set('fields', 'id,name,access_token,picture,instagram_business_account');
    url.searchParams.set('access_token', longLivedToken);

    const res = await fetch(url.toString());
    const data = await res.json() as any;

    if (data.error) {
        throw new Error(`Failed to fetch pages: ${data.error.message}`);
    }

    return data.data || [];
}

/** Subscribe a page to webhook events */
async function subscribePage(pageId: string, pageAccessToken: string): Promise<boolean> {
    const url = `${FB_GRAPH}/${pageId}/subscribed_apps`;
    const params = new URLSearchParams({
        subscribed_fields: 'feed,messages,mention,name,picture,category,description,conversations,inbox_labels',
        access_token: pageAccessToken,
    });

    const res = await fetch(`${url}?${params}`, { method: 'POST' });
    const data = await res.json() as any;

    if (data.error) {
        console.error(`[fb-oauth] Page subscription failed for ${pageId}:`, data.error.message);
        return false;
    }

    return data.success === true;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
    const headers = {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    // CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    if (event.httpMethod !== 'GET') {
        return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
    }

    const code = event.queryStringParameters?.code;
    const error = event.queryStringParameters?.error;

    // User denied permission
    if (error) {
        console.warn('[fb-oauth] User denied OAuth:', error);
        return {
            statusCode: 302,
            headers: { ...headers, Location: '/connected-accounts?error=access_denied' },
            body: '',
        };
    }

    if (!code) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing code parameter' }) };
    }

    try {
        const appId = getEnv('FB_APP_ID');
        const appSecret = getEnv('FB_APP_SECRET');
        const redirectUri = getEnv('FB_REDIRECT_URI');

        // Step 1: Exchange code for short-lived user access token
        const tokenUrl = new URL(`${FB_GRAPH}/oauth/access_token`);
        tokenUrl.searchParams.set('client_id', appId);
        tokenUrl.searchParams.set('client_secret', appSecret);
        tokenUrl.searchParams.set('redirect_uri', redirectUri);
        tokenUrl.searchParams.set('code', code);

        const tokenRes = await fetch(tokenUrl.toString());
        const tokenData = await tokenRes.json() as any;

        if (tokenData.error) {
            throw new Error(`Code exchange failed: ${tokenData.error.message}`);
        }

        const shortLivedToken: string = tokenData.access_token;

        // Step 2: Exchange for long-lived token (60 days)
        const { token: longLivedToken, expiresIn } = await exchangeForLongLivedToken(shortLivedToken);
        const tokenExpiry = Date.now() + expiresIn * 1000;

        // Step 3: Fetch user's pages
        const pages = await fetchUserPages(longLivedToken);

        if (pages.length === 0) {
            return {
                statusCode: 302,
                headers: { ...headers, Location: '/connected-accounts?error=no_pages' },
                body: '',
            };
        }

        // Step 4: Process each page — encrypt tokens, check IG, subscribe
        const db = (await import('./utils/db')).db;
        let successCount = 0;

        for (const page of pages) {
            const pageToken: string = page.access_token;
            const encryptedPageToken = await encryptToken(pageToken);

            // Page tokens from /me/accounts are already long-lived when user token is long-lived
            const pageTokenExpiry = tokenExpiry;

            // Step 3: FORCE PAGE SUBSCRIPTION (Requirement 3)
            const subscribed = await subscribePage(page.id, pageToken);

            // Check Instagram Business Account
            const instagramId: string | undefined = page.instagram_business_account?.id;
            const instagramLinked = !!instagramId;

            const accountData = {
                pageId: page.id,
                pageName: page.name,
                platform: 'facebook',
                encryptedToken: encryptedPageToken, // STORED IN DB ONLY
                tokenExpiry: pageTokenExpiry,
                subscriptionStatus: subscribed,
                instagramId: instagramId || null,
                instagramLinked,
                avatarUrl: page.picture?.data?.url || null,
                connectedAt: Date.now(),
                status: subscribed ? 'healthy' : 'action_required',
            };

            // Requirement 8: Store encrypted tokens only in database
            await db.upsertAccount(accountData);

            if (!subscribed) {
                await db.markAccountIncomplete(page.id, 'Webhook subscription failed. Reconnect required.');
            }

            // If IG linked, add as separate account entry logic can be handled by DB or frontend
            // For now, we just ensure the Page is connected and token is safe.
            successCount++;
        }

        // Return ONLY connection status to frontend (Requirement 1)
        // Frontend receives only: oauth_success=1&count=N
        return {
            statusCode: 302,
            headers: {
                ...headers,
                Location: `/connected-accounts?oauth_success=1&count=${successCount}`,
            },
            body: '',
        };

    } catch (err: any) {
        console.error('[fb-oauth] Error:', err.message);
        return {
            statusCode: 302,
            headers: { ...headers, Location: `/connected-accounts?error=server_error&msg=${encodeURIComponent(err.message)}` },
            body: '',
        };
    }
};
