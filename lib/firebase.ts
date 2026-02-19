// src/lib/firebase.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app;
let auth;

try {
    if (
        !firebaseConfig.apiKey ||
        !firebaseConfig.authDomain ||
        !firebaseConfig.projectId ||
        !firebaseConfig.appId
    ) {
        console.error("❌ Firebase env variables missing");
    } else {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        console.log("✅ Firebase initialized successfully");
    }
} catch (error) {
    console.error("🔥 Firebase initialization error:", error);
}

export { auth };