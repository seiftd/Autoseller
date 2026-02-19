// lib/firebase.ts — Production-safe Firebase initialization

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const missingKeys = Object.entries(firebaseConfig)
    .filter(([, v]) => !v)
    .map(([k]) => k);

if (missingKeys.length > 0) {
    console.error(`[Firebase] Missing env variables: ${missingKeys.join(', ')}. Check Netlify environment settings.`);
} else {
    try {
        // Singleton: reuse existing app if already initialized (e.g. HMR in dev)
        app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("[Firebase] Initialized successfully.");
    } catch (error) {
        console.error("[Firebase] Initialization failed:", error);
    }
}

export { app, auth };