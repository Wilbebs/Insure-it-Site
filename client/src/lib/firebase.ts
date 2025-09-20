// Firebase configuration for Insure-it insurance website
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "insure-it-7b5b8.firebaseapp.com",
  projectId: "insure-it-7b5b8",
  storageBucket: "insure-it-7b5b8.firebasestorage.app",
  messagingSenderId: "104320218286",
  appId: "1:104320218286:web:b977586d027564e3d6533f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;