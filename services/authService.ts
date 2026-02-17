import { User, Session, UserRole } from '../types';

// Mock DB of Users
const MOCK_USERS: User[] = [
  { 
    id: 'user_123_admin', 
    email: 'admin@replygenie.com', 
    fullName: 'Admin User', 
    role: 'owner', 
    plan: 'business',
    createdAt: Date.now() 
  },
  { 
    id: 'user_456_manager', 
    email: 'manager@replygenie.com', 
    fullName: 'Support Manager', 
    role: 'manager', 
    plan: 'business', // Inherits plan from workspace usually, but simplified here
    createdAt: Date.now() 
  },
  { 
    id: 'user_789_free', 
    email: 'test@replygenie.com', 
    fullName: 'Test Merchant', 
    role: 'owner', 
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
    if (username === 'manager' && pass === 'password') user = MOCK_USERS[1];
    if (username === 'test' && pass === 'password') user = MOCK_USERS[2];

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
  // For managers, this should return their Owner's ID (Workspace ID)
  // In this simplified mock, we assume 'manager' belongs to 'user_123_admin' workspace
  getTenantId: (): string => {
    const user = authService.getCurrentUser();
    if (!user) return 'public';
    
    if (user.role === 'manager') return 'user_123_admin'; // Hardcoded link for demo
    return user.id; 
  },

  hasRole: (requiredRole: UserRole): boolean => {
      const user = authService.getCurrentUser();
      if (!user) return false;
      if (user.role === 'admin') return true; // Admin has all permissions
      if (requiredRole === 'manager') return true; // Everyone is at least a manager/viewer
      return user.role === requiredRole;
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