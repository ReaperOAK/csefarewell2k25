import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

const firebaseConfig = {

  apiKey: "AIzaSyCuvZ2iQp6kK7FJ6yC7Z4oIwwURejzx_z4",

  authDomain: "rishabhfarewell-99e6a.firebaseapp.com",

  projectId: "rishabhfarewell-99e6a",

  storageBucket: "rishabhfarewell-99e6a.firebasestorage.app",

  messagingSenderId: "299027473981",

  appId: "1:299027473981:web:f08df75a39193dd7042c54",

  measurementId: "G-N6PFVDYKRR"

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