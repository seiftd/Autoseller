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
        if (!auth) {
            console.error("Auth context failed: Firebase Auth is not initialized.");
            setAuthLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email: string, password: string) => {
        if (!auth) return Promise.reject("Firebase Auth not initialized");
        return signInWithEmailAndPassword(auth, email, password).then(() => { });
    };

    const register = (email: string, password: string) => {
        if (!auth) return Promise.reject("Firebase Auth not initialized");
        return createUserWithEmailAndPassword(auth, email, password).then(() => { });
    };

    const logout = () => {
        if (!auth) return Promise.reject("Firebase Auth not initialized");
        return signOut(auth);
    };

    const value = {
        currentUser,
        authLoading,
        login,
        register,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
