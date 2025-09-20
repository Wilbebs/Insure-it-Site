// Firebase Admin SDK for server-side operations
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'insure-it-7b5b8',
    storageBucket: 'insure-it-7b5b8.firebasestorage.app'
  });
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const adminAuth = admin.auth();
export default admin;