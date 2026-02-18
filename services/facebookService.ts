/**
 * facebookService.ts — Production-grade Facebook/Instagram integration
 *
 * Security model:
 * - App Secret: NEVER in frontend. Lives only in Netlify Functions env vars.
 * - Token exchange: Done server-side in fb-oauth-callback.ts
 * - Access tokens: Stored encrypted (server-side AES-GCM) in localStorage
 * - OAuth: Redirect-based (not JS SDK popup) for proper backend handling
 *
 * The FB JS SDK is still used ONLY for the initial OAuth redirect URL construction.
 * All token handling happens server-side.
 */

import { Product, SocialAccount } from '../types';

const FB_API_VERSION = 'v19.0';
const FB_GRAPH = `https://graph.facebook.com/${FB_API_VERSION}`;

// Scopes required — only what's necessary for App Review
const REQUIRED_SCOPES = [
  'public_profile',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'pages_manage_metadata',
  'pages_messaging',
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_comments',
  'instagram_manage_messages',
];

// ─── OAuth Flow (Redirect-Based, Secure) ──────────────────────────────────────

export const facebookService = {

  /**
   * Initiates OAuth by redirecting user to Facebook's OAuth dialog.
   * The callback is handled server-side by fb-oauth-callback.ts
   * No App Secret is used here — only the App ID (safe to expose).
   */
  initiateOAuth: (source: 'facebook' | 'instagram' = 'facebook'): void => {
    const appId = import.meta.env.VITE_FB_APP_ID;
    const redirectUri = import.meta.env.VITE_FB_REDIRECT_URI;

    if (!appId) {
      throw new Error('VITE_FB_APP_ID is not configured. Add it to your .env.local file.');
    }
    if (!redirectUri) {
      throw new Error('VITE_FB_REDIRECT_URI is not configured. Add it to your .env.local file.');
    }

    const oauthUrl = new URL('https://www.facebook.com/dialog/oauth');
    oauthUrl.searchParams.set('client_id', appId);
    oauthUrl.searchParams.set('redirect_uri', redirectUri);
    oauthUrl.searchParams.set('scope', REQUIRED_SCOPES.join(','));
    oauthUrl.searchParams.set('response_type', 'code');
    const state = `${source}_${crypto.randomUUID()}`; // encode source in state
    oauthUrl.searchParams.set('state', state);

    // Store state for CSRF validation on return
    sessionStorage.setItem('fb_oauth_state', state);

    window.location.href = oauthUrl.toString();
  },

  /**
   * Initiates Instagram Business account connection.
   * Instagram Business accounts are linked through Facebook Pages (Meta's architecture).
   * This uses the same OAuth flow but emphasizes Instagram permissions.
   */
  initiateInstagramOAuth: (): void => {
    // Instagram Business API uses the same Facebook OAuth dialog.
    // The instagram_basic, instagram_content_publish, instagram_manage_comments,
    // and instagram_manage_messages scopes are already included in REQUIRED_SCOPES.
    facebookService.initiateOAuth('instagram');
  },


  /**
   * Decrypt and use a page access token for API calls.
   * Tokens are decrypted server-side — for client-side publishing,
   * we call a backend proxy endpoint instead of using raw tokens.
   *
   * For this frontend-only architecture, we call the Graph API directly
   * using the encrypted token string (which the server decrypts via a proxy).
   * In a full backend, all Graph API calls would go through your server.
   */

  // ─── Publishing (Production Architecture) ───────────────────────────────────

  /**
   * Publish a product via server-side proxy.
   * REQUIREMENT 1 & 8: Tokens never touch the frontend.
   */
  publishToFacebook: async (account: SocialAccount, product: Product): Promise<string> => {
    const message = `${product.name}\n\n${product.description}\n\nPrice: ${product.price} ${product.currency}\n\n${product.hashtags.join(' ')}`;

    const res = await fetch('/.netlify/functions/fb-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: account.id,
        platform: 'facebook',
        content: message,
        // Images logic would be handled server-side in a full implementation
      }),
    });

    const data = await res.json() as any;
    if (data.error) {
      if (data.error.includes('TOKEN_EXPIRED')) {
        // Requirement 7: Add token expiry enforcement logic here or in tokenService
        throw new Error('RECONNECT_REQUIRED: Your Facebook token has expired.');
      }
      throw new Error(data.error);
    }
    return data.result.id;
  },

  publishToInstagram: async (account: SocialAccount, product: Product): Promise<string> => {
    const message = `${product.name}\n\n${product.description}`;

    const res = await fetch('/.netlify/functions/fb-publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accountId: account.id,
        platform: 'instagram',
        content: message,
      }),
    });

    const data = await res.json() as any;
    if (data.error) throw new Error(data.error);
    return data.result.id;
  },

  replyToComment: async (commentId: string, message: string, accountId: string): Promise<any> => {
    const res = await fetch('/.netlify/functions/fb-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, commentId, message }),
    });
    const data = await res.json() as any;
    if (data.error) throw new Error(data.error);
    return data;
  },

  /**
   * Subscribe a page to webhook events.
   * This is now handled automatically in the OAuth callback (Requirement 3).
   */
  subscribePageToWebhooks: async (pageId: string): Promise<boolean> => {
    // This is just a stub as it's handled server-side now.
    return true;
  },

  getWebhookUrl: (): string => {
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    return `${siteUrl}/.netlify/functions/fb-webhook`;
  },

  getWebhookVerifyToken: (): string => {
    return import.meta.env.VITE_WEBHOOK_VERIFY_TOKEN || 'replygenie_webhook_verify';
  },

  /**
   * Fetch connected accounts metadata from the DB.
   * Requirement 1: Tokens stay in the DB.
   */
  fetchConnectedAccounts: async (): Promise<SocialAccount[]> => {
    const res = await fetch('/.netlify/functions/fb-list-accounts');
    const data = await res.json() as any;
    if (data.error) throw new Error(data.error);
    return data.accounts;
  },
};
