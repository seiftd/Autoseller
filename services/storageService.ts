import { Product, Order, SocialAccount, UserStats, Conversation, Message, DeliverySettings, Country, PublishLog, WebhookEvent, Job, ErrorLog, AuditLog, SpamProtectionLog } from '../types';
import { DEFAULT_COUNTRIES } from '../constants';
import { authService } from './authService';
// Note: We avoid importing securityService here to prevent circular dependency if securityService imports storageService
// We will move the "Encryption" call to the logic layer (ConnectedAccounts page) or use a lightweight helper if needed.
// However, since we defined securityService in a separate file, let's see. 
// securityService imports storageService for logging. storageService imports securityService for decryption?
// Circular dependency risk.
// SOLUTION: storageService only STORES encrypted strings. The Service using the data (e.g. facebookService) calls securityService to decrypt.
// storageService doesn't need to decrypt.

const PRODUCTS_KEY = 'autoseller_products';
const ORDERS_KEY = 'autoseller_orders';
const ACCOUNTS_KEY = 'autoseller_accounts';
const CONVERSATIONS_KEY = 'autoseller_conversations';
const SETTINGS_KEY = 'autoseller_settings';
const COUNTRIES_KEY = 'autoseller_countries';
const PUBLISH_LOGS_KEY = 'autoseller_publish_logs';
const WEBHOOK_EVENTS_KEY = 'autoseller_webhook_events';
const JOBS_KEY = 'autoseller_jobs';
const FAILED_JOBS_KEY = 'autoseller_failed_jobs';
const ERROR_LOGS_KEY = 'autoseller_error_logs';
const AUDIT_LOGS_KEY = 'autoseller_audit_logs';
const SPAM_LOGS_KEY = 'autoseller_spam_logs';

// Helper for Multi-Tenancy
// In a real DB, this is enforced by WHERE user_id = ?
const getTenantId = () => authService.getTenantId();

// Mock Data Initialization
// We need to inject userIds into mock data
const MOCK_USER_ID = 'user_123_admin'; // Default mock owner

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', userId: MOCK_USER_ID, platform: 'Facebook', name: 'Tech Store DZ', connected: true, lastSync: Date.now() },
  { id: '2', userId: MOCK_USER_ID, platform: 'Instagram', name: '@techstoredz', connected: false, lastSync: 0 },
];

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1',
    userId: MOCK_USER_ID, 
    name: 'Smart Watch Ultra', 
    description: 'The ultimate smart watch with 3-day battery life and AMOLED display.',
    price: 4500, 
    stock: 50, 
    category: 'Electronics',
    hashtags: ['#smartwatch', '#tech', '#dzshop'],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
    images: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=600&q=80'
    ],
    active: true,
    targetCountryId: 'dz',
    currency: 'DZD',
    shipping: { 
        type: 'paid', 
        defaultCost: 600, 
        locationCosts: { 'Algiers': 400 }, 
        companies: ['Yalidine'] 
    },
    paymentMethods: ['cod'],
    targetAccountIds: ['1'],
    publishedTo: ['Facebook'],
    publishMode: 'instant',
    publishStatus: 'published',
    isRecurring: true,
    recurrenceInterval: 7,
    lastPublishedAt: Date.now() - 86400000,
    nextPublishAt: Date.now() + (6 * 86400000)
  },
  // ... other mock products would also need userId
];

const MOCK_SETTINGS: DeliverySettings = {
    defaultCost: 600,
    shippingCompany: 'Yalidine'
};

export const storageService = {
  // COUNTRIES (Global Data - No Tenant Isolation needed)
  getCountries: (): Country[] => {
      const data = localStorage.getItem(COUNTRIES_KEY);
      if (!data) {
          localStorage.setItem(COUNTRIES_KEY, JSON.stringify(DEFAULT_COUNTRIES));
          return DEFAULT_COUNTRIES;
      }
      return JSON.parse(data);
  },
  saveCountries: (countries: Country[]) => {
      localStorage.setItem(COUNTRIES_KEY, JSON.stringify(countries));
  },

  // ACCOUNTS (Tenant Isolated)
  getAccounts: (): SocialAccount[] => {
    const uid = getTenantId();
    const data = localStorage.getItem(ACCOUNTS_KEY);
    let all: SocialAccount[] = data ? JSON.parse(data) : MOCK_ACCOUNTS;
    
    // Filter by Tenant
    return all.filter(a => a.userId === uid);
  },
  
  // Note: encryption happens before saving in the UI layer calling this
  saveAccounts: (accounts: SocialAccount[]) => {
      // In a real DB, we would save only the user's accounts. 
      // Here with localStorage, we must read ALL, remove user's current, add new user's, save ALL.
      const uid = getTenantId();
      const allData = localStorage.getItem(ACCOUNTS_KEY);
      let all: SocialAccount[] = allData ? JSON.parse(allData) : MOCK_ACCOUNTS;
      
      const otherUsersAccounts = all.filter(a => a.userId !== uid);
      // Ensure all new accounts have the userId
      const accountsWithId = accounts.map(a => ({ ...a, userId: uid }));
      
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...otherUsersAccounts, ...accountsWithId]));
  },

  toggleAccount: (id: string) => {
    const uid = getTenantId();
    const all = storageService.getAllAccountsRaw(); // Helper to get everything
    const idx = all.findIndex(a => a.id === id && a.userId === uid); // Security Check
    
    if (idx >= 0) {
      all[idx].connected = !all[idx].connected;
      all[idx].lastSync = Date.now();
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(all));
    }
  },

  // PRODUCTS (Tenant Isolated)
  getProducts: (): Product[] => {
    const uid = getTenantId();
    const data = localStorage.getItem(PRODUCTS_KEY);
    let all: Product[] = data ? JSON.parse(data) : MOCK_PRODUCTS;
    return all.filter(p => p.userId === uid);
  },
  saveProduct: (product: Product) => {
    const uid = getTenantId();
    const all = storageService.getAllProductsRaw();
    const p = { ...product, userId: uid }; // Enforce ownership
    
    const index = all.findIndex(item => item.id === p.id); // Global ID check is fine
    // Security check: if updating, ensure it belongs to user
    if (index >= 0) {
        if (all[index].userId !== uid) throw new Error("Unauthorized access to product");
        all[index] = p;
    } else {
        all.unshift(p);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
  },
  saveProducts: (userProducts: Product[]) => {
      const uid = getTenantId();
      const all = storageService.getAllProductsRaw();
      const others = all.filter(p => p.userId !== uid);
      const secureUserProducts = userProducts.map(p => ({...p, userId: uid}));
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify([...others, ...secureUserProducts]));
  },
  deleteProduct: (id: string) => {
    const uid = getTenantId();
    const all = storageService.getAllProductsRaw();
    const filtered = all.filter(p => !(p.id === id && p.userId === uid)); // Only delete if owned
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  // ORDERS (Tenant Isolated)
  getOrders: (): Order[] => {
    const uid = getTenantId();
    const data = localStorage.getItem(ORDERS_KEY);
    const all: Order[] = data ? JSON.parse(data) : [];
    return all.filter(o => o.userId === uid);
  },
  addOrder: (order: Order) => {
    // Orders typically come from Webhooks (System), so userId should be set by the worker
    const all = storageService.getAllOrdersRaw();
    all.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  },

  // PUBLISH LOGS (Tenant Isolated)
  getPublishLogs: (): PublishLog[] => {
      const uid = getTenantId();
      const data = localStorage.getItem(PUBLISH_LOGS_KEY);
      const all: PublishLog[] = data ? JSON.parse(data) : [];
      return all.filter(l => l.userId === uid);
  },
  addPublishLog: (log: PublishLog) => {
      // Typically system action, log contains userId
      const all = storageService.getAllPublishLogsRaw();
      all.unshift(log);
      if (all.length > 500) all.pop(); // Global cap for localStorage
      localStorage.setItem(PUBLISH_LOGS_KEY, JSON.stringify(all));
  },

  // AUDIT LOGS (Tenant Isolated)
  getAuditLogs: (): AuditLog[] => {
      const uid = getTenantId();
      const data = localStorage.getItem(AUDIT_LOGS_KEY);
      const all: AuditLog[] = data ? JSON.parse(data) : [];
      return all.filter(l => l.userId === uid);
  },
  addAuditLog: (log: AuditLog) => {
      const data = localStorage.getItem(AUDIT_LOGS_KEY);
      const all: AuditLog[] = data ? JSON.parse(data) : [];
      all.unshift(log);
      if (all.length > 200) all.pop();
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(all));
  },

  // SPAM LOGS
  logSpamProtection: (userId: string, reason: any, details: any) => {
      const log: SpamProtectionLog = {
          id: crypto.randomUUID(),
          userId,
          reason,
          details,
          blockedAt: Date.now()
      };
      const data = localStorage.getItem(SPAM_LOGS_KEY);
      const all: SpamProtectionLog[] = data ? JSON.parse(data) : [];
      all.unshift(log);
      localStorage.setItem(SPAM_LOGS_KEY, JSON.stringify(all));
  },

  // WEBHOOK EVENTS (System Level - No Isolation needed for queue, but processing needs care)
  getWebhookEvents: (): WebhookEvent[] => {
    const data = localStorage.getItem(WEBHOOK_EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveWebhookEvent: (event: WebhookEvent) => {
    const list = storageService.getWebhookEvents();
    const existingIndex = list.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) {
      list[existingIndex] = event;
    } else {
      list.unshift(event);
    }
    if (list.length > 500) list.length = 500;
    localStorage.setItem(WEBHOOK_EVENTS_KEY, JSON.stringify(list));
  },
  findWebhookEventByPlatformId: (platformId: string): WebhookEvent | undefined => {
    const list = storageService.getWebhookEvents();
    return list.find(e => e.platformEventId === platformId);
  },

  // JOBS (System Level)
  getJobs: (): Job[] => {
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveJobs: (jobs: Job[]) => {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  },
  addJob: (job: Job) => {
    const list = storageService.getJobs();
    list.push(job);
    localStorage.setItem(JOBS_KEY, JSON.stringify(list));
  },
  removeJob: (id: string) => {
    const list = storageService.getJobs().filter(j => j.id !== id);
    localStorage.setItem(JOBS_KEY, JSON.stringify(list));
  },

  // ERROR LOGS (System Level)
  getErrorLogs: (): ErrorLog[] => {
    const data = localStorage.getItem(ERROR_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  logError: (log: ErrorLog) => {
    const list = storageService.getErrorLogs();
    list.unshift(log);
    if (list.length > 100) list.pop();
    localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(list));
  },
  
  // FAILED JOBS (System Level)
  getFailedJobs: (): Job[] => {
      const data = localStorage.getItem(FAILED_JOBS_KEY);
      return data ? JSON.parse(data) : [];
  },
  saveFailedJob: (job: Job) => {
      const list = storageService.getFailedJobs();
      list.unshift(job);
      localStorage.setItem(FAILED_JOBS_KEY, JSON.stringify(list));
  },
  removeFailedJob: (id: string) => {
      const list = storageService.getFailedJobs().filter(j => j.id !== id);
      localStorage.setItem(FAILED_JOBS_KEY, JSON.stringify(list));
  },

  // STATS (Tenant Isolated)
  getStats: (): UserStats => {
    const orders = storageService.getOrders(); // Already filtered
    const products = storageService.getProducts(); // Already filtered
    const accounts = storageService.getAccounts(); // Already filtered
    const logs = storageService.getPublishLogs(); // Already filtered
    
    return {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      activeProducts: products.filter(p => p.active).length,
      connectedAccounts: accounts.filter(a => a.connected).length,
      messagesProcessed: 0, // Need to track processed messages per user
      recentOrders: orders.slice(0, 5),
      scheduledPosts: products.filter(p => p.publishStatus === 'scheduled').length,
      publishedPosts: products.filter(p => p.publishStatus === 'published').length,
      recurringActive: products.filter(p => p.isRecurring && p.active).length,
      totalReposts: logs.filter(l => l.publishType === 'recurring' && l.status === 'success').length
    };
  },

  // RAW HELPERS (Internal use to get full lists for updates)
  getAllAccountsRaw: (): SocialAccount[] => {
      const data = localStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : MOCK_ACCOUNTS;
  },
  getAllProductsRaw: (): Product[] => {
      const data = localStorage.getItem(PRODUCTS_KEY);
      return data ? JSON.parse(data) : MOCK_PRODUCTS;
  },
  getAllOrdersRaw: (): Order[] => {
      const data = localStorage.getItem(ORDERS_KEY);
      return data ? JSON.parse(data) : [];
  },
  getAllPublishLogsRaw: (): PublishLog[] => {
      const data = localStorage.getItem(PUBLISH_LOGS_KEY);
      return data ? JSON.parse(data) : [];
  },

  // CONVERSATIONS
  getConversations: (): Conversation[] => {
      const uid = getTenantId();
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) return [];
      const all: Conversation[] = JSON.parse(data);
      return all.filter(c => c.userId === uid);
  },
  saveConversation: (conv: Conversation) => {
      const uid = getTenantId();
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      const all: Conversation[] = data ? JSON.parse(data) : [];
      const index = all.findIndex(c => c.id === conv.id);
      
      const secureConv = { ...conv, userId: uid };
      
      if (index >= 0) {
          if (all[index].userId !== uid) throw new Error("Access Denied");
          all[index] = secureConv;
      } else {
          all.unshift(secureConv);
      }
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(all));
  }
};