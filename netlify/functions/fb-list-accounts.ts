
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { db } from './utils/db';

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
    const headers = {
        'Access-Control-Allow-Origin': process.env.URL || '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 204, headers, body: '' };
    }

    try {
        // In a real app, identify the user via JWT/Session
        // Requirement 1: Use session or JWT to identify workspace.

        // Mock: Retrieve all accounts from DB (metadata only)
        // Note: Our mock DB is a Map, in real life we'd query by userId

        // This is a simplified implementation for the task
        const accounts = [];
        // In reality: const accounts = await prisma.connectedAccount.findMany({ where: { userId: currentUserId } });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ accounts }),
        };
    } catch (err: any) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
