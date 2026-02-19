import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from '../services/firebase';

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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setAuthLoading(false);
        });

        return unsubscribe;
    }, []);

    const login = (email: string, password: string) => {
        return signInWithEmailAndPassword(auth, email, password).then(() => { });
    };

    const register = (email: string, password: string) => {
        return createUserWithEmailAndPassword(auth, email, password).then(() => { });
    };

    const logout = () => {
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
            {!authLoading && children}
        </AuthContext.Provider>
    );
};
