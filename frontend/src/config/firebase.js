import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials are supplied (at least projectId and apiKey)
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey.trim() !== '' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId.trim() !== '' &&
  !firebaseConfig.apiKey.includes('your_api_key')
);

let app = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    console.info('🔥 Cloud Firestore initialized successfully for project:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('⚠️ Cloud Firestore initialization failed, falling back to local storage:', error);
    db = null;
  }
} else {
  console.info('ℹ️ Firebase environment variables not set. Krishi Sakhi is operating in High-Speed Local Storage Mode.');
}

export { app, db, firebaseConfig };
