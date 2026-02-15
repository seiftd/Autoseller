import { Product, Order, SocialAccount, UserStats, Conversation, Message, DeliverySettings } from '../types';

const PRODUCTS_KEY = 'autoseller_products';
const ORDERS_KEY = 'autoseller_orders';
const ACCOUNTS_KEY = 'autoseller_accounts';
const CONVERSATIONS_KEY = 'autoseller_conversations';
const SETTINGS_KEY = 'autoseller_settings';

// Mock Data Initialization
const MOCK_ACCOUNTS: SocialAccount[] = [
  { id: '1', platform: 'Facebook', name: 'Tech Store DZ', connected: true, lastSync: Date.now() },
  { id: '2', platform: 'Instagram', name: '@techstoredz', connected: false, lastSync: 0 },
  { id: '3', platform: 'WhatsApp', name: '+213 555 123 456', connected: true, lastSync: Date.now() },
];

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Smart Watch Ultra', 
    description: 'The ultimate smart watch with 3-day battery life and AMOLED display.',
    price: 4500, 
    stock: 50, 
    category: 'Electronics',
    hashtags: ['#smartwatch', '#tech', '#dzshop'],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=300&q=80',
    active: true,
    shipping: { type: 'paid', defaultCost: 600, wilayaCosts: { 'Algiers': 400 }, companies: ['Yalidine'] },
    paymentMethods: ['cod'],
    publishedTo: ['Facebook']
  },
  { 
    id: '2', 
    name: 'Wireless Earbuds Pro', 
    description: 'Noise cancelling earbuds with transparency mode.',
    price: 2800, 
    stock: 120, 
    category: 'Audio',
    hashtags: ['#earbuds', '#music', '#promo'],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=300&q=80',
    active: true,
    shipping: { type: 'free', defaultCost: 0, wilayaCosts: {}, companies: ['Yalidine'] },
    paymentMethods: ['cod'],
    publishedTo: ['Facebook', 'WhatsApp']
  }
];

const MOCK_SETTINGS: DeliverySettings = {
    defaultCost: 600,
    shippingCompany: 'Yalidine'
};

export const storageService = {
  // ACCOUNTS
  getAccounts: (): SocialAccount[] => {
    const data = localStorage.getItem(ACCOUNTS_KEY);
    if (!data) {
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(MOCK_ACCOUNTS));
        return MOCK_ACCOUNTS;
    }
    return JSON.parse(data);
  },
  toggleAccount: (id: string) => {
    const list = storageService.getAccounts();
    const idx = list.findIndex(a => a.id === id);
    if (idx >= 0) {
      list[idx].connected = !list[idx].connected;
      list[idx].lastSync = Date.now();
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
    }
  },

  // PRODUCTS
  getProducts: (): Product[] => {
    const data = localStorage.getItem(PRODUCTS_KEY);
    if (!data) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(MOCK_PRODUCTS));
        return MOCK_PRODUCTS;
    }
    return JSON.parse(data);
  },
  saveProduct: (product: Product) => {
    const list = storageService.getProducts();
    const index = list.findIndex(p => p.id === product.id);
    if (index >= 0) list[index] = product;
    else list.unshift(product);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  },
  deleteProduct: (id: string) => {
    const list = storageService.getProducts().filter(p => p.id !== id);
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  },

  // ORDERS
  getOrders: (): Order[] => {
    const data = localStorage.getItem(ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  },
  addOrder: (order: Order) => {
    const list = storageService.getOrders();
    list.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(list));
  },

  // SETTINGS
  getSettings: (): DeliverySettings => {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (!data) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(MOCK_SETTINGS));
        return MOCK_SETTINGS;
    }
    return JSON.parse(data);
  },
  saveSettings: (settings: DeliverySettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  },

  // STATS
  getStats: (): UserStats => {
    const orders = storageService.getOrders();
    const products = storageService.getProducts();
    const accounts = storageService.getAccounts();
    
    return {
      totalOrders: orders.length,
      revenue: orders.reduce((sum, o) => sum + o.total, 0),
      activeProducts: products.filter(p => p.active).length,
      connectedAccounts: accounts.filter(a => a.connected).length,
      messagesProcessed: 342, // Mock
      recentOrders: orders.slice(0, 5)
    };
  },

  // CONVERSATIONS
  getConversations: (): Conversation[] => {
      const data = localStorage.getItem(CONVERSATIONS_KEY);
      if (!data) return [];
      return JSON.parse(data);
  },
  saveConversation: (conv: Conversation) => {
      const list = storageService.getConversations();
      const index = list.findIndex(c => c.id === conv.id);
      if (index >= 0) list[index] = conv;
      else list.unshift(conv);
      localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(list));
  }
};