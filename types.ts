export type Language = 'en' | 'fr' | 'ar';

export type Platform = 'Facebook' | 'Instagram' | 'WhatsApp';

export interface SocialAccount {
  id: string;
  platform: Platform;
  name: string;
  connected: boolean;
  avatarUrl?: string;
  lastSync: number;
}

export interface ShippingConfig {
  type: 'free' | 'paid' | 'custom';
  defaultCost: number;
  freeThreshold?: number;
  wilayaCosts: Record<string, number>; // wilaya name -> cost
  companies: string[];
}

export interface DeliverySettings {
  defaultCost: number;
  shippingCompany: 'Yalidine' | 'ZR Express' | 'EMS' | 'Custom';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  hashtags: string[];
  imageUrl?: string;
  images?: string[];
  active: boolean;
  shipping: ShippingConfig;
  paymentMethods: ('cod' | 'prepaid')[];
  publishedTo: Platform[];
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  items: { productId: string; quantity: number; priceAtOrder: number; name: string }[];
  total: number;
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
}

export interface Translation {
  [key: string]: {
    en: string;
    fr: string;
    ar: string;
  };
}