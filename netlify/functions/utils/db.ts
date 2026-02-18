
import { SocialAccount } from '../../../types';

/**
 * Mock Database Implementation for Netlify Functions
 * In production, replace this with calls to Supabase, Prisma/PostgreSQL, etc.
 */

// Simulated In-Memory DB (will persist across some Netlify invocations but not reliable)
// In a real app, use: import { createClient } from '@supabase/supabase-js'
const mockDb = new Map<string, any>();

export const db = {
    /**
     * Upsert a connected account to the database.
     * Tokens are stored ENCRYPTED.
     */
    upsertAccount: async (account: any): Promise<void> => {
        const key = `account:${account.pageId || account.instagramId}`;
        console.log(`[DB] Storing account ${key} - TOKEN REDACTED FROM LOGS`);

        // In reality: 
        // await prisma.connectedAccount.upsert({ ... })
        mockDb.set(key, {
            ...account,
            updatedAt: Date.now()
        });
    },

    /**
     * Get an account by ID from the database.
     */
    getAccount: async (id: string): Promise<any | null> => {
        return mockDb.get(`account:${id}`) || null;
    },

    /**
     * Fetch the encrypted token for a specific page.
     */
    getPageToken: async (pageId: string): Promise<string | null> => {
        const account = await db.getAccount(pageId);
        return account?.encryptedToken || null;
    },

    /**
     * Mark an account as incomplete if subscription fails.
     */
    markAccountIncomplete: async (pageId: string, reason: string): Promise<void> => {
        const account = await db.getAccount(pageId);
        if (account) {
            account.status = 'action_required';
            account.subscriptionStatus = false;
            account.errorNote = reason;
            await db.upsertAccount(account);
        }
    },

    /**
     * Requirement 4: Robust idempotency system.
     * Checks if an event has already been processed.
     */
    checkIdempotency: async (eventId: string): Promise<boolean> => {
        if (processedEvents.has(eventId)) return true;
        processedEvents.add(eventId);
        return false;
    }
};

const processedEvents = new Set<string>();
