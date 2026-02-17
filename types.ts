export type Language = 'en' | 'fr' | 'ar';

export type Platform = 'Facebook' | 'Instagram';

export type Currency = 'DZD' | 'EUR' | 'USD' | 'MAD' | 'TND';

export type UserRole = 'admin' | 'user';
export type SubscriptionPlan = 'free' | 'pro' | 'business';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  plan: SubscriptionPlan;
  createdAt: number;
}

export interface Session {
  id: string;
  device: string;
  location: string;
  ip: string;
  lastActive: number;
  current: boolean;
}

export interface SocialAccount {
  id: string;
  userId: string; // Tenant Isolation
  platform: Platform;
  name: string;
  connected: boolean;
  avatarUrl?: string;
  lastSync: number;
  // Facebook Specifics
  accessToken?: string; // Encrypted
  pageId?: string;
  instagramId?: string; // Linked IG Business ID
}

export interface FacebookConfig {
  appId: string;
  apiVersion: string;
}

export interface Region {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
  currency: Currency;
  regions: Region[];
  shippingCompanies: string[];
}

export interface ShippingConfig {
  type: 'free' | 'paid' | 'custom';
  defaultCost: number;
  freeThreshold?: number;
  locationCosts: Record<string, number>; // region name -> cost
  companies: string[];
}

// Deprecated in favor of Country configuration, but kept for compatibility if needed
export interface DeliverySettings {
  defaultCost: number;
  shippingCompany: 'Yalidine' | 'ZR Express' | 'EMS' | 'Custom';
}

export interface Product {
  id: string;
  userId: string; // Tenant Isolation
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  hashtags: string[];
  imageUrl?: string;
  images?: string[];
  active: boolean;
  
  // Multi-country fields
  targetCountryId: string;
  currency: Currency;

  shipping: ShippingConfig;
  paymentMethods: ('cod' | 'prepaid')[];
  
  // Publishing Targets
  targetAccountIds: string[]; // IDs of connected_accounts
  publishedTo: Platform[]; // Historical kept for display

  // Scheduling & Recurrence
  publishMode: 'instant' | 'scheduled';
  publishStatus: 'draft' | 'scheduled' | 'published';
  scheduledAt?: number;
  
  // Recurring Logic
  isRecurring: boolean;
  recurrenceInterval: number; // in days
  lastPublishedAt?: number;
  nextPublishAt?: number; // timestamp for next auto-repost
}

export interface PublishLog {
  id: string;
  userId: string; // Tenant Isolation
  productId: string;
  productName: string;
  accountId: string;
  accountName: string;
  platform: Platform;
  publishType: 'instant' | 'scheduled' | 'recurring';
  status: 'success' | 'failed';
  publishedAt: number;
  errorMessage?: string;
}

export interface Order {
  id: string;
  userId: string; // Tenant Isolation
  customerName: string;
  phone: string;
  wilaya: string; // Keep for backward compat, acts as region
  address: string;
  items: { productId: string; quantity: number; priceAtOrder: number; name: string }[];
  total: number;
  currency: Currency;
  countryId?: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: number;
  platform: Platform;
  notes?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  type?: 'comment' | 'message';
}

export interface Conversation {
  id: string;
  userId: string; // Tenant Isolation
  customerName: string;
  platform: Platform;
  lastMessage: string;
  lastMessageTime: number;
  messages: Message[];
  status: 'active' | 'bot_active' | 'bot_paused';
  unreadCount: number;
  priority: boolean;
}

export interface UserStats {
  totalOrders: number;
  revenue: number;
  activeProducts: number;
  connectedAccounts: number;
  messagesProcessed: number;
  recentOrders: Order[];
  scheduledPosts: number;
  publishedPosts: number;
  
  // New Analytics
  recurringActive: number;
  totalReposts: number;
}

export interface Translation {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}

// --- NEW TYPES FOR PRODUCTION WEBHOOK SYSTEM ---

export interface WebhookEvent {
  id: string;
  // Webhooks are global entry points, but processed events should be linked to a tenant if possible
  // via page_id mapping
  platformEventId: string; 
  platform: Platform;
  payload: any;
  receivedAt: number;
  status: 'pending' | 'processed' | 'failed' | 'ignored';
  retryCount: number;
  errorMessage?: string;
}

export interface Job {
  id: string;
  type: 'process_webhook' | 'publish_product';
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: number;
  attempts: number;
  maxAttempts: number;
  nextAttemptAt: number;
  error?: string;
}

export interface ErrorLog {
  id: string;
  type: 'webhook' | 'job' | 'api' | 'security';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  stack?: string;
  metadata?: any;
  timestamp: number;
}

export interface SystemHealth {
  queueSize: number;
  failedJobs: number;
  webhookSuccessRate: number;
  uptime: number;
  lastError?: ErrorLog;
}

// --- SECURITY & COMPLIANCE TYPES ---

export interface AuditLog {
  id: string;
  userId: string;
  action: string; // e.g., 'login', 'publish_product', 'connect_account'
  targetId?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: number;
  details?: any;
}

export interface SpamProtectionLog {
  id: string;
  userId: string;
  reason: 'rate_limit' | 'reply_loop' | 'duplicate_content' | 'bot_loop';
  blockedAt: number;
  details: any;
}