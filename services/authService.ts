import { User, Session, UserRole } from '../types';
import { User as FirebaseUser } from 'firebase/auth';

let currentUser: User | null = null;

export const authService = {
  // Sync Firebase User to App User
  syncUser: (firebaseUser: FirebaseUser | null): User | null => {
    if (!firebaseUser) {
      currentUser = null;
      return null;
    }

    currentUser = {
      id: firebaseUser.uid,
      email: firebaseUser.email || '',
      fullName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      role: 'owner', // Default role
      plan: 'free',  // Default plan
      createdAt: Date.now() // Approximated
    };

    return currentUser;
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
    return [];
  },

  logoutAllSessions: async (): Promise<void> => {
    console.log("Logged out all sessions");
  }
};