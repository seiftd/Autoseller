import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
    currentUser: User | null;
    authLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    googleLogin: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        // CRITICAL: Guard against auth being null if Firebase failed to initialize
        if (!auth) {
            console.error("[AuthContext] Firebase Auth is not initialized. Check env variables.");
            setAuthLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        }, (error) => {
            // Handle auth state errors (e.g. network issues) without crashing
            console.error("[AuthContext] onAuthStateChanged error:", error);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        if (!auth) {
            return Promise.reject(new Error("Firebase Auth is not available. Please check your configuration."));
        }
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string): Promise<void> => {
        if (!auth) {
            return Promise.reject(new Error("Firebase Auth is not available. Please check your configuration."));
        }
        await createUserWithEmailAndPassword(auth, email, password);
    };

    const googleLogin = async (): Promise<void> => {
        if (!auth) {
            return Promise.reject(new Error("Firebase Auth is not available. Please check your configuration."));
        }
        const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async (): Promise<void> => {
        if (!auth) {
            return Promise.reject(new Error("Firebase Auth is not available."));
        }
        await signOut(auth);
    };

    const value: AuthContextType = {
        currentUser,
        authLoading,
        login,
        register,
        googleLogin,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
