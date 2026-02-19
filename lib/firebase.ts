import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";

/**
 * PRODUCTION-GRADE FIREBASE INITIALIZATION
 * 
 * Logic:
 * 1. Validate environment variables exist (prevent white screen crash).
 * 2. Use singleton pattern to avoid multiple initialization.
 * 3. Safely handle analytics initialization.
 */

interface FirebaseConfig {
    apiKey: string;
    authDomain: string;
    projectId: string;
    appId: string;
}

const getFirebaseConfig = (): FirebaseConfig | null => {
    const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };

    const required: (keyof FirebaseConfig)[] = ['apiKey', 'authDomain', 'projectId', 'appId'];
    const missing = required.filter(key => !config[key]);

    if (missing.length > 0) {
        // Log clear console error as requested in Step 1 & 2
        console.error(`[Firebase Initialization] CRITICAL ERROR: Missing environment variables: ${missing.join(', ')}`);
        console.error(`Please ensure VITE_FIREBASE_* variables are set in your .env or Netlify settings.`);
        return null;
    }

    return config as FirebaseConfig;
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

const initializeFirebase = () => {
    const config = getFirebaseConfig();

    if (!config) {
        console.warn("[Firebase] Initialization aborted due to missing configuration.");
        return;
    }

    try {
        // Singleton pattern
        if (getApps().length > 0) {
            app = getApp();
        } else {
            app = initializeApp(config);
        }

        auth = getAuth(app);

        if (typeof window !== 'undefined') {
            analyticsPromise = isSupported().then(yes => yes ? getAnalytics(app!) : null).catch(() => null);
        }
    } catch (error) {
        console.error("[Firebase] Initialization failed:", error);
    }
};

// Initialize immediately
initializeFirebase();

// Helper to provide clear error messages if auth is accessed before it's ready
// This prevents direct crashes by providing a meaningful error if initialization failed.
const getSafeAuth = (): Auth => {
    if (!auth) {
        const error = new Error("Firebase Auth accessed but not initialized. Check your environment variables.");
        console.error(error);
        throw error;
    }
    return auth;
};

export { app, auth, analyticsPromise as analytics, getSafeAuth };
