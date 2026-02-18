import { Product, Order, SocialAccount, UserStats, Conversation, Message, DeliverySettings, Country, PublishLog, WebhookEvent, Job, ErrorLog, AuditLog, SpamProtectionLog, WorkspaceMember, NotificationPreferences, AddOn, UserAddOn, TokenRefreshLog, AccountHealthStatus } from '../types';
import { DEFAULT_COUNTRIES } from '../constants';
import { authService } from './authService';

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
const WORKSPACE_MEMBERS_KEY = 'autoseller_workspace_members';
const NOTIFICATION_PREFS_KEY = 'autoseller_notification_prefs';
const USER_ADDONS_KEY = 'autoseller_user_addons';
const TOKEN_REFRESH_LOGS_KEY = 'autoseller_token_refresh_logs';

// Helper for Multi-Tenancy
// In a real DB, this is enforced by WHERE user_id = ?
const getTenantId = () => authService.getTenantId();

// Mock Data Initialization
// We need to inject userIds into mock data
const MOCK_USER_ID = 'user_123_admin'; // Default mock owner

const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', userId: MOCK_USER_ID, platform: 'Facebook', name: 'Tech Store DZ', connected: true, lastSync: Date.now(), tokenExpiry: Date.now() + 86400000 * 5 }, // 5 days left (warning state)
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
];

export const storageService = {
  // COUNTRIES (Global Data - No Tenant Isolation needed)
  getCountries: (): Country[] => {
    if (typeof window === 'undefined') return DEFAULT_COUNTRIES;
    const data = localStorage.getItem(COUNTRIES_KEY);
    if (!data) {
      localStorage.setItem(COUNTRIES_KEY, JSON.stringify(DEFAULT_COUNTRIES));
      return DEFAULT_COUNTRIES;
    }
    return JSON.parse(data);
  },
  saveCountries: (countries: Country[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COUNTRIES_KEY, JSON.stringify(countries));
    }
  },

  // ACCOUNTS (Tenant Isolated)
  getAccounts: (): SocialAccount[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return MOCK_ACCOUNTS.filter(a => a.userId === uid);
    const data = localStorage.getItem(ACCOUNTS_KEY);
    let all: SocialAccount[] = data ? JSON.parse(data) : MOCK_ACCOUNTS;

    // Filter by Tenant
    return all.filter(a => a.userId === uid);
  },

  saveAccounts: (accounts: SocialAccount[]) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const allData = localStorage.getItem(ACCOUNTS_KEY);
    let all: SocialAccount[] = allData ? JSON.parse(allData) : MOCK_ACCOUNTS;

    const otherUsersAccounts = all.filter(a => a.userId !== uid);
    const accountsWithId = accounts.map(a => ({ ...a, userId: uid }));

    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...otherUsersAccounts, ...accountsWithId]));
  },

  toggleAccount: (id: string) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const all = storageService.getAllAccountsRaw();
    const idx = all.findIndex(a => a.id === id && a.userId === uid);

    if (idx >= 0) {
      all[idx].connected = !all[idx].connected;
      all[idx].lastSync = Date.now();
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(all));
    }
  },

  // PRODUCTS (Tenant Isolated)
  getProducts: (): Product[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return MOCK_PRODUCTS.filter(p => p.userId === uid);
    const data = localStorage.getItem(PRODUCTS_KEY);
    let all: Product[] = data ? JSON.parse(data) : MOCK_PRODUCTS;
    return all.filter(p => p.userId === uid);
  },
  saveProduct: (product: Product) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const all = storageService.getAllProductsRaw();
    const p = { ...product, userId: uid }; // Enforce ownership

    const index = all.findIndex(item => item.id === p.id);
    if (index >= 0) {
      if (all[index].userId !== uid) throw new Error("Unauthorized access to product");
      all[index] = p;
    } else {
      all.unshift(p);
    }
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(all));
  },
  saveProducts: (userProducts: Product[]) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const all = storageService.getAllProductsRaw();
    const others = all.filter(p => p.userId !== uid);
    const secureUserProducts = userProducts.map(p => ({ ...p, userId: uid }));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify([...others, ...secureUserProducts]));
  },
  deleteProduct: (id: string) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const all = storageService.getAllProductsRaw();
    const filtered = all.filter(p => !(p.id === id && p.userId === uid));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(filtered));
  },

  // ORDERS (Tenant Isolated)
  getOrders: (): Order[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ORDERS_KEY);
    const all: Order[] = data ? JSON.parse(data) : [];
    return all.filter(o => o.userId === uid);
  },
  addOrder: (order: Order) => {
    if (typeof window === 'undefined') return;
    const all = storageService.getAllOrdersRaw();
    all.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(all));
  },

  // PUBLISH LOGS (Tenant Isolated)
  getPublishLogs: (): PublishLog[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PUBLISH_LOGS_KEY);
    const all: PublishLog[] = data ? JSON.parse(data) : [];
    return all.filter(l => l.userId === uid);
  },
  addPublishLog: (log: PublishLog) => {
    if (typeof window === 'undefined') return;
    const all = storageService.getAllPublishLogsRaw();
    all.unshift(log);
    if (all.length > 500) all.pop();
    localStorage.setItem(PUBLISH_LOGS_KEY, JSON.stringify(all));
  },

  // AUDIT / ACTIVITY LOGS (Tenant Isolated)
  getAuditLogs: (): AuditLog[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    const all: AuditLog[] = data ? JSON.parse(data) : [];
    return all.filter(l => l.userId === uid);
  },
  addAuditLog: (log: AuditLog) => {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(AUDIT_LOGS_KEY);
    const all: AuditLog[] = data ? JSON.parse(data) : [];
    all.unshift(log);
    if (all.length > 200) all.pop();
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(all));
  },

  // SPAM LOGS
  logSpamProtection: (userId: string, reason: any, details: any) => {
    if (typeof window === 'undefined') return;
    const log: SpamProtectionLog = {
      id: window.crypto.randomUUID(),
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

  // WORKSPACE MEMBERS
  getWorkspaceMembers: (): WorkspaceMember[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(WORKSPACE_MEMBERS_KEY);
    const all: WorkspaceMember[] = data ? JSON.parse(data) : [];
    return all.filter(m => m.workspaceId === uid);
  },
  addWorkspaceMember: (member: WorkspaceMember) => {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(WORKSPACE_MEMBERS_KEY);
    const all: WorkspaceMember[] = data ? JSON.parse(data) : [];
    all.push(member);
    localStorage.setItem(WORKSPACE_MEMBERS_KEY, JSON.stringify(all));
  },
  removeWorkspaceMember: (memberId: string) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const data = localStorage.getItem(WORKSPACE_MEMBERS_KEY);
    let all: WorkspaceMember[] = data ? JSON.parse(data) : [];
    all = all.filter(m => !(m.id === memberId && m.workspaceId === uid));
    localStorage.setItem(WORKSPACE_MEMBERS_KEY, JSON.stringify(all));
  },

  // ADD-ONS
  getUserAddons: (): UserAddOn[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(USER_ADDONS_KEY);
    const all: UserAddOn[] = data ? JSON.parse(data) : [];
    return all.filter(addon => addon.userId === uid && addon.active);
  },
  toggleAddon: (addonId: string, active: boolean) => {
    if (typeof window === 'undefined') return;
    const uid = getTenantId();
    const data = localStorage.getItem(USER_ADDONS_KEY);
    let all: UserAddOn[] = data ? JSON.parse(data) : [];

    const existingIdx = all.findIndex(a => a.userId === uid && a.addonId === addonId);

    if (active) {
      if (existingIdx === -1) {
        all.push({
          id: window.crypto.randomUUID(),
          userId: uid,
          addonId,
          active: true,
          purchasedAt: Date.now()
        });
      } else {
        all[existingIdx].active = true;
      }
    } else {
      if (existingIdx !== -1) {
        all[existingIdx].active = false;
      }
    }
    localStorage.setItem(USER_ADDONS_KEY, JSON.stringify(all));
  },

  // NOTIFICATION PREFERENCES
  getNotificationPreferences: (): NotificationPreferences => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return { userId: uid, notifyOnPublishFail: true, notifyOnTokenExpiry: true, notifyOnWeeklyReport: false };
    const data = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    const all: NotificationPreferences[] = data ? JSON.parse(data) : [];
    return all.find(p => p.userId === uid) || {
      userId: uid, notifyOnPublishFail: true, notifyOnTokenExpiry: true, notifyOnWeeklyReport: false
    };
  },
  saveNotificationPreferences: (prefs: NotificationPreferences) => {
    if (typeof window === 'undefined') return;
    const data = localStorage.getItem(NOTIFICATION_PREFS_KEY);
    let all: NotificationPreferences[] = data ? JSON.parse(data) : [];
    const idx = all.findIndex(p => p.userId === prefs.userId);
    if (idx >= 0) all[idx] = prefs;
    else all.push(prefs);
    localStorage.setItem(NOTIFICATION_PREFS_KEY, JSON.stringify(all));
  },

  // SYSTEM LEVEL (Events, Jobs, Errors)
  getWebhookEvents: (): WebhookEvent[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(WEBHOOK_EVENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveWebhookEvent: (event: WebhookEvent) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getWebhookEvents();
    const existingIndex = list.findIndex(e => e.id === event.id);
    if (existingIndex >= 0) list[existingIndex] = event;
    else list.unshift(event);
    if (list.length > 500) list.length = 500;
    localStorage.setItem(WEBHOOK_EVENTS_KEY, JSON.stringify(list));
  },
  findWebhookEventByPlatformId: (platformId: string): WebhookEvent | undefined => {
    const list = storageService.getWebhookEvents();
    return list.find(e => e.platformEventId === platformId);
  },
  getJobs: (): Job[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(JOBS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveJobs: (jobs: Job[]) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  },
  addJob: (job: Job) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getJobs();
    list.push(job);
    localStorage.setItem(JOBS_KEY, JSON.stringify(list));
  },
  removeJob: (id: string) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getJobs().filter(j => j.id !== id);
    localStorage.setItem(JOBS_KEY, JSON.stringify(list));
  },
  getErrorLogs: (): ErrorLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ERROR_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  logError: (log: ErrorLog) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getErrorLogs();
    list.unshift(log);
    if (list.length > 100) list.pop();
    localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(list));
  },
  // TOKEN REFRESH LOGS
  getTokenRefreshLogs: (): TokenRefreshLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(TOKEN_REFRESH_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveTokenRefreshLog: (log: TokenRefreshLog) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getTokenRefreshLogs();
    list.unshift(log);
    if (list.length > 200) list.length = 200;
    localStorage.setItem(TOKEN_REFRESH_LOGS_KEY, JSON.stringify(list));
  },

  // ACCOUNT HEALTH
  updateAccountStatus: (id: string, status: AccountHealthStatus) => {
    if (typeof window === 'undefined') return;
    const all = storageService.getAllAccountsRaw();
    const idx = all.findIndex(a => a.id === id);
    if (idx >= 0) {
      all[idx].status = status;
      localStorage.setItem('autoseller_accounts', JSON.stringify(all));
    }
  },
  getAccountHealthSummary: (): { healthy: number; expiring: number; actionRequired: number } => {
    const accounts = storageService.getAccounts();
    return {
      healthy: accounts.filter(a => !a.status || a.status === 'healthy').length,
      expiring: accounts.filter(a => a.status === 'expiring_soon').length,
      actionRequired: accounts.filter(a => a.status === 'action_required' || a.status === 'reconnection_required').length,
    };
  },

  getFailedJobs: (): Job[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(FAILED_JOBS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveFailedJob: (job: Job) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getFailedJobs();
    list.unshift(job);
    localStorage.setItem(FAILED_JOBS_KEY, JSON.stringify(list));
  },
  removeFailedJob: (id: string) => {
    if (typeof window === 'undefined') return;
    const list = storageService.getFailedJobs().filter(j => j.id !== id);
    localStorage.setItem(FAILED_JOBS_KEY, JSON.stringify(list));
  },

  // STATS (Tenant Isolated)
  getStats: (): UserStats => {
    const orders = storageService.getOrders();
    const products = storageService.getProducts();
    const accounts = storageService.getAccounts();
    const logs = storageService.getPublishLogs();

    return {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      activeProducts: products.filter(p => p.active).length,
      connectedAccounts: accounts.filter(a => a.connected).length,
      messagesProcessed: 0,
      recentOrders: orders.slice(0, 5),
      scheduledPosts: products.filter(p => p.publishStatus === 'scheduled').length,
      publishedPosts: products.filter(p => p.publishStatus === 'published').length,
      recurringActive: products.filter(p => p.isRecurring && p.active).length,
      totalReposts: logs.filter(l => l.publishType === 'recurring' && l.status === 'success').length
    };
  },

  // RAW HELPERS (Internal use to get full lists for updates)
  getAllAccountsRaw: (): SocialAccount[] => {
    if (typeof window === 'undefined') return MOCK_ACCOUNTS;
    const data = localStorage.getItem(ACCOUNTS_KEY);
    return data ? JSON.parse(data) : MOCK_ACCOUNTS;
  },
  getAllProductsRaw: (): Product[] => {
    if (typeof window === 'undefined') return MOCK_PRODUCTS;
    const data = localStorage.getItem(PRODUCTS_KEY);
    return data ? JSON.parse(data) : MOCK_PRODUCTS;
  },
  getAllOrdersRaw: (): Order[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  getAllPublishLogsRaw: (): PublishLog[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(PUBLISH_LOGS_KEY);
    return data ? JSON.parse(data) : [];
  },

  // CONVERSATIONS
  getConversations: (): Conversation[] => {
    const uid = getTenantId();
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(CONVERSATIONS_KEY);
    if (!data) return [];
    const all: Conversation[] = JSON.parse(data);
    return all.filter(c => c.userId === uid);
  },
  saveConversation: (conv: Conversation) => {
    if (typeof window === 'undefined') return;
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