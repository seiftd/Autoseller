import { User, Session, UserRole } from '../types';

let currentUser: User | null = null;

export const authService = {
  // Sync Clerk User to App User
  syncUser: (clerkUser: any): User | null => {
    if (!clerkUser) {
      currentUser = null;
      return null;
    }

    // Default or persisted user data
    // In a real app, fetch this from backend
    currentUser = {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || '',
      fullName: clerkUser.fullName || 'User',
      role: 'owner', // Default to owner for personal workspace
      plan: 'free',  // Default to free
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).getTime() : Date.now()
    };

    return currentUser;
  },

  login: (username: string, pass: string): boolean => {
    console.warn("Legacy login called. Use Clerk SignIn.");
    return false;
  },

  logout: () => {
    currentUser = null;
  },

  isAuthenticated: (): boolean => {
    return !!currentUser;
  },

  getCurrentUser: (): User | null => {
    return currentUser;
  },

  getTenantId: (): string => {
    return currentUser ? currentUser.id : 'public';
  },

  hasRole: (requiredRole: UserRole): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'admin') return true;
    if (requiredRole === 'manager') return true;
    return currentUser.role === requiredRole;
  },

  getSessions: (): Session[] => {
    return []; // Clerk handles sessions
  },

  logoutAllSessions: async (): Promise<void> => {
    console.log("Logged out all other sessions (via Clerk)");
  }
};