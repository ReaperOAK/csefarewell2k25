import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Fallback configuration in case environment variables are not loaded properly
// This helps during development but should be removed in production
const fallbackConfig = {
  apiKey: "AIzaSyAm3GrtCxIrK6fU-K6TgVx46yamlFlV9Pc",
  authDomain: "oblivion-3c64c.firebaseapp.com",
  projectId: "oblivion-3c64c",
  storageBucket: "oblivion-3c64c.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "669343480639",
  appId: "1:669343480639:web:3962f1d1a4f36c4c25f18a",
  measurementId: "G-GTJR1LE68Z"
};

// Use environment variables if available, otherwise use fallback
const finalConfig = {
  apiKey: firebaseConfig.apiKey || fallbackConfig.apiKey,
  authDomain: firebaseConfig.authDomain || fallbackConfig.authDomain,
  projectId: firebaseConfig.projectId || fallbackConfig.projectId,
  storageBucket: firebaseConfig.storageBucket || fallbackConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId || fallbackConfig.messagingSenderId,
  appId: firebaseConfig.appId || fallbackConfig.appId,
  measurementId: firebaseConfig.measurementId || fallbackConfig.measurementId
};

// Initialize Firebase with error handling
let app;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;
let analytics: any;

try {
  app = initializeApp(finalConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  
  // Only initialize analytics if running in browser and not in SSR
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error; // Re-throw to ensure app fails if Firebase can't initialize
}

export { app, db, auth, analytics };