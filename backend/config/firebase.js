let admin = null;
let db = null;
let auth = null;

try {
  admin = require('firebase-admin');
  const { getFirestore } = require('firebase-admin/firestore');
  const { getAuth } = require('firebase-admin/auth');

  const isInitialized = admin.getApps && admin.getApps().length > 0;

  if (!isInitialized) {
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id') {
      admin.initializeApp({
        credential: admin.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        }),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET
      });
      console.log('Firebase initialized with service account');
    } else {
      process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
      admin.initializeApp({ projectId: 'demo-faunarescue' });
      console.log('Firebase initialized in demo/emulator mode');
    }
  }

  db = getFirestore();
  auth = getAuth();
  console.log('Firestore and Auth ready');
} catch (error) {
  console.error('Firebase setup error:', error.message);
}

module.exports = { admin, db, auth };
