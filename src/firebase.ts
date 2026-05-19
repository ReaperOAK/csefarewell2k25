import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAm3GrtCxIrK6fU-K6TgVx46yamlFlV9Pc",
  authDomain: "oblivion-3c64c.firebaseapp.com",
  projectId: "oblivion-3c64c",
  storageBucket: "oblivion-3c64c.firebasestorage.app",
  messagingSenderId: "669343480639",
  appId: "1:669343480639:web:3962f1d1a4f36c4c25f18a",
  measurementId: "G-GTJR1LE68Z"
};

// SSR-safe Firebase initialization
// Use non-null assertions for client-only use
let firestoreInstance: Firestore = null as unknown as Firestore;
let authInstance: Auth = null as unknown as Auth;

const initFirebase = () => {
  if (typeof window !== 'undefined') {
    try {
      const app = initializeApp(firebaseConfig, 'oblivion-app');
      firestoreInstance = getFirestore(app);
      authInstance = getAuth(app);
      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }
};

initFirebase();

export const db = firestoreInstance;
export const auth = authInstance;