import { storageService } from './storageService';
import { facebookService } from './facebookService';

export const schedulerService = {
  start: () => {
    // Check every minute
    setInterval(schedulerService.checkSchedule, 60000);
    // Also check on load with a slight delay
    setTimeout(schedulerService.checkSchedule, 5000); 
  },

  checkSchedule: async () => {
    const products = storageService.getProducts();
    const now = Date.now();
    let changed = false;

    for (const product of products) {
      if (product.publishStatus === 'scheduled' && product.scheduledAt && product.scheduledAt <= now) {
        // Time to publish
        console.log(`[Scheduler] Publishing product ${product.name}...`);
        
        try {
           const accounts = storageService.getAccounts().filter(a => a.connected);
           const platforms: any[] = [];
           
           if (accounts.length === 0) {
               console.warn(`[Scheduler] No connected accounts found for scheduled product ${product.name}. Skipping.`);
               continue;
           }

           for (const account of accounts) {
               if (account.platform === 'Facebook') {
                   await facebookService.publishToFacebook(account, product);
                   platforms.push('Facebook');
               } else if (account.platform === 'Instagram') {
                   await facebookService.publishToInstagram(account, product);
                   platforms.push('Instagram');
               }
           }
           
           // Update Product Status
           product.publishStatus = 'published';
           product.publishedTo = platforms;
           product.active = true;
           changed = true;
           console.log(`[Scheduler] Successfully published ${product.name} to ${platforms.join(', ')}`);
        } catch (err) {
            console.error(`[Scheduler] Failed to publish ${product.name}`, err);
            // In a real system, we might set status to 'failed'
        }
      }
    }

    if (changed) {
        storageService.saveProducts(products);
        // Force UI update if necessary by dispatching event, though React components usually pull on mount or interaction.
        // For Dashboard live updates, a context or polling mechanism would be better, but this suffices for the scope.
    }
  }
};