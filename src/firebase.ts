import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAm3GrtCxIrK6fU-K6TgVx46yamlFlV9Pc",
  authDomain: "oblivion-3c64c.firebaseapp.com",
  projectId: "oblivion-3c64c",
  storageBucket: "oblivion-3c64c.firebasestorage.app",
  messagingSenderId: "669343480639",
  appId: "1:669343480639:web:3962f1d1a4f36c4c25f18a",
  measurementId: "G-GTJR1LE68Z"
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;
let analytics: any;

try {
  app = initializeApp(firebaseConfig);
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