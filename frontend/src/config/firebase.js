// Dummy Firebase config to prevent errors
let auth, googleProvider, signInWithPopup;

try {
  // Try to import Firebase only if it's properly configured
  const { initializeApp } = require("firebase/app");
  const { getAuth, GoogleAuthProvider, signInWithPopup: _signInWithPopup } = require("firebase/auth");
  
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "dummy",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "dummy",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "dummy",
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "dummy",
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "dummy",
    appId: process.env.REACT_APP_FIREBASE_APP_ID || "dummy"
  };

  // Only initialize if we have real config
  if (firebaseConfig.apiKey !== "dummy") {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    signInWithPopup = _signInWithPopup;
  } else {
    // Dummy objects to prevent errors
    auth = { currentUser: null };
    googleProvider = {};
    signInWithPopup = () => Promise.reject(new Error('Firebase not configured'));
  }
} catch (e) {
  console.log('Firebase not available, using dummy auth');
  auth = { currentUser: null };
  googleProvider = {};
  signInWithPopup = () => Promise.reject(new Error('Firebase not configured'));
}

export { auth, googleProvider, signInWithPopup };
