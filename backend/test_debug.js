const dotenv = require('dotenv');
dotenv.config();
console.log('Dotenv version:', require('dotenv/package.json').version);
const key = process.env.FIREBASE_PRIVATE_KEY;
console.log('Key length:', key.length);
console.log('Has actual newlines:', key.includes('\n'));
console.log('Has literal backslash-n:', key.includes('\\n'));
console.log('First 100:', JSON.stringify(key.substring(0, 100)));
// Try admin.cert
const admin = require('firebase-admin');
try {
  const app = admin.initializeApp({
    credential: admin.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: key,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
  console.log('cert() succeeded');
  const { getFirestore } = require('firebase-admin/firestore');
  const db = getFirestore();
  db.collection('test').limit(1).get()
    .then(snap => console.log('Firestore OK docs:', snap.size))
    .catch(err => console.log('Firestore error:', err.code, err.message));
} catch(e) {
  console.log('cert() error:', e.message);
}
