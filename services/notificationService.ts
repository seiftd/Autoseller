import { storageService } from './storageService';
import { authService } from './authService';

export const notificationService = {
  
  sendEmailAlert: async (type: 'publish_failure' | 'token_expiry', data: any) => {
    const prefs = storageService.getNotificationPreferences();
    
    // Check Preferences
    if (type === 'publish_failure' && !prefs.notifyOnPublishFail) return;
    if (type === 'token_expiry' && !prefs.notifyOnTokenExpiry) return;

    // Simulate API Call to Email Provider (Resend/SendGrid)
    console.log(`[NotificationService] Sending Email Alert [${type}] to User...`);
    console.log('Data:', data);
    
    // In a real app: await fetch('/api/send-email', { ... })
    await new Promise(r => setTimeout(r, 500)); 
  },

  updatePreferences: (newPrefs: any) => {
      const user = authService.getCurrentUser();
      if (!user) return;
      storageService.saveNotificationPreferences({ ...newPrefs, userId: user.id });
  },

  getPreferences: () => {
      return storageService.getNotificationPreferences();
  }
};