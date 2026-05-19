import { initializeApp, FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// Analytics only works client-side

const firebaseConfig = {
  apiKey: "AIzaSyAm3GrtCxIrK6fU-K6TgVx46yamlFlV9Pc",
  authDomain: "oblivion-3c64c.firebaseapp.com",
  projectId: "oblivion-3c64c",
  storageBucket: "oblivion-3c64c.firebasestorage.app",
  messagingSenderId: "669343480639",
  appId: "1:669343480639:web:3962f1d1a4f36c4c25f18a",
  measurementId: "G-GTJR1LE68Z"
};

let app: FirebaseApp;
let db: ReturnType<typeof getFirestore>;
let auth: ReturnType<typeof getAuth>;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, db, auth };