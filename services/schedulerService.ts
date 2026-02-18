import { storageService } from './storageService';
import { facebookService } from './facebookService';
import { Product, PublishLog } from '../types';

export const schedulerService = {
    start: () => {
        // Check every minute
        setInterval(schedulerService.checkSchedule, 60000);
        // Also check on load with a slight delay
        setTimeout(schedulerService.checkSchedule, 5000);
    },

    checkSchedule: async () => {
        const products = storageService.getProducts();
        const accounts = storageService.getAccounts().filter(a => a.connected);
        const now = Date.now();
        let changed = false;

        for (const product of products) {
            // Condition 1: Scheduled One-Time Publish
            const isScheduledRun = product.publishStatus === 'scheduled' && product.scheduledAt && product.scheduledAt <= now;

            // Condition 2: Recurring Publish
            const isRecurringRun = product.isRecurring && product.active && product.nextPublishAt && product.nextPublishAt <= now;

            if (isScheduledRun || isRecurringRun) {
                console.log(`[Scheduler] Publishing product ${product.name}... Mode: ${isRecurringRun ? 'Recurring' : 'Scheduled'}`);

                const targetIds = product.targetAccountIds || [];
                if (targetIds.length === 0) {
                    console.warn(`[Scheduler] No target accounts for ${product.name}. Skipping.`);
                    continue;
                }

                const targetAccounts = accounts.filter(a => targetIds.includes(a.id));
                const platformsPublished: string[] = [];

                for (const account of targetAccounts) {
                    const log: PublishLog = {
                        id: (typeof window !== 'undefined' && window.crypto?.randomUUID) ? window.crypto.randomUUID() : Math.random().toString(36),
                        userId: product.userId,
                        productId: product.id,
                        productName: product.name,
                        accountId: account.id,
                        accountName: account.name,
                        platform: account.platform,
                        publishType: isRecurringRun ? 'recurring' : 'scheduled',
                        status: 'success',
                        publishedAt: Date.now()
                    };

                    try {
                        if (account.platform === 'Facebook') {
                            await facebookService.publishToFacebook(account, product);
                            platformsPublished.push('Facebook');
                        } else if (account.platform === 'Instagram') {
                            await facebookService.publishToInstagram(account, product);
                            platformsPublished.push('Instagram');
                        }
                        storageService.addPublishLog(log);
                    } catch (err: any) {
                        console.error(`[Scheduler] Failed to publish ${product.name} to ${account.name}`, err);
                        log.status = 'failed';
                        log.errorMessage = err.message || 'Unknown error';
                        storageService.addPublishLog(log);
                    }
                }

                // Update Product State
                if (isScheduledRun) {
                    product.publishStatus = 'published';
                    product.scheduledAt = undefined;
                }

                if (isRecurringRun) {
                    product.lastPublishedAt = now;
                    // Calculate next run
                    const nextRun = new Date(now);
                    nextRun.setDate(nextRun.getDate() + (product.recurrenceInterval || 7));
                    product.nextPublishAt = nextRun.getTime();

                    // If it was just a one-time scheduled but marked recurring, keep status published
                    product.publishStatus = 'published';
                }

                // Update UI list of platforms
                // Merge new platforms with existing
                const uniquePlatforms = new Set([...(product.publishedTo || []), ...platformsPublished]);
                product.publishedTo = Array.from(uniquePlatforms) as any;

                changed = true;
            }
        }

        if (changed) {
            storageService.saveProducts(products);
        }
    }
};