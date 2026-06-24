let admin = null;
let db = null;
let auth = null;

try {
  admin = require('firebase-admin');
  const { getFirestore } = require('firebase-admin/firestore');
  const { getAuth } = require('firebase-admin/auth');

  const isInitialized = admin.getApps && admin.getApps().length > 0;

  if (!isInitialized) {
    // Try to use service account if env vars are set, otherwise use demo mode
    let initialized = false;
    
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'your-firebase-project-id') {
      try {
        // Try to initialize with service account
        if (admin.credential && admin.credential.cert) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
          });
          console.log('Firebase initialized with service account');
          initialized = true;
        }
      } catch (e) {
        console.log('Service account init failed, using demo mode:', e.message);
      }
    }

    if (!initialized) {
      // Demo mode (no real Firebase needed)
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
  // Even if Firebase fails, we'll still have a dummy db for test data
}

module.exports = { admin, db, auth };
