/**
 * Firebase Configuration and Initialization
 * 
 * This module initializes the Firebase app and exports the authentication
 * and Firestore database instances used throughout the application.
 * 
 * Security Rules: All read/write operations are protected by Firestore
 * security rules that enforce user-level data isolation.
 */

import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase configuration object
 * These values should be provided by your Firebase project console.
 * For security, sensitive values should be stored in environment variables.
 * 
 * Update these values with your Firebase project credentials.
 * Get these from: Firebase Console > Project Settings > Web App
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Validate that required Firebase configuration is present
 * This prevents silent failures if config values are missing
 */
const validateConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId'];
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
  
  if (missingKeys.length > 0) {
    console.warn(
      `Missing Firebase config keys: ${missingKeys.join(', ')}. ` +
      `Please set these environment variables in your .env file.`
    );
  }
};

validateConfig();

/**
 * Initialize Firebase app
 * This creates a singleton Firebase app instance
 */
const app = initializeApp(firebaseConfig);

/**
 * Get Firebase Authentication instance
 * Configured with local persistence to maintain user sessions
 */
const auth = getAuth(app);

/**
 * Enable local persistence for auth state
 * This keeps users logged in across browser sessions
 */
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('Failed to set auth persistence:', error);
});

/**
 * Get Firestore database instance
 * All database operations use this instance with security rules enforcement
 */
const db = getFirestore(app);

export { auth, db };
