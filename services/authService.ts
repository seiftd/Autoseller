import { User, Session } from '../types';

// Mock DB of Users
const MOCK_USERS: User[] = [
  { 
    id: 'user_123_admin', 
    email: 'admin@replygenie.com', 
    fullName: 'Admin User', 
    role: 'admin', 
    plan: 'business',
    createdAt: Date.now() 
  },
  { 
    id: 'user_456_free', 
    email: 'test@replygenie.com', 
    fullName: 'Test Merchant', 
    role: 'user', 
    plan: 'free',
    createdAt: Date.now() 
  }
];

const CURRENT_USER_KEY = 'replygenie_current_user';

export const authService = {
  login: (username: string, pass: string): boolean => {
    // Mock Login Logic
    let user = MOCK_USERS.find(u => u.email === username); // Treat username as email for mock
    
    // Simple mock credential check
    if (username === 'admin' && pass === 'password') user = MOCK_USERS[0];
    if (username === 'test' && pass === 'password') user = MOCK_USERS[1];

    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  },
  
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(CURRENT_USER_KEY);
  },

  getCurrentUser: (): User | null => {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  },

  // Helper to get Tenant ID
  getTenantId: (): string => {
    const user = authService.getCurrentUser();
    return user ? user.id : 'public'; // 'public' or null for unauthenticated
  },

  // Security features (Mock)
  getSessions: (): Session[] => {
    return [
      { id: '1', device: 'Chrome on Windows 11', location: 'Algiers, Algeria', ip: '154.121.xx.xx', lastActive: Date.now(), current: true },
      { id: '2', device: 'Safari on iPhone 14', location: 'Oran, Algeria', ip: '129.45.xx.xx', lastActive: Date.now() - 7200000, current: false },
      { id: '3', device: 'Firefox on MacOS', location: 'Paris, France', ip: '89.12.xx.xx', lastActive: Date.now() - 86400000, current: false },
    ];
  },

  logoutAllSessions: async (): Promise<void> => {
    // Mock API call delay
    await new Promise(r => setTimeout(r, 1000));
    console.log("Logged out all other sessions");
  }
};