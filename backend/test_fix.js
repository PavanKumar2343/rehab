require('dotenv').config();
const admin = require('firebase-admin');

// Reformat the key with proper 64-char lines
const raw = process.env.FIREBASE_PRIVATE_KEY;
const b64 = raw
  .replace('-----BEGIN PRIVATE KEY-----\n', '')
  .replace('-----END PRIVATE KEY-----\n', '')
  .replace('\n', '')
  .trim();

// Rebuild with proper line breaks
const pem = '-----BEGIN PRIVATE KEY-----\n' +
  b64.match(/.{1,64}/g).join('\n') +
  '\n-----END PRIVATE KEY-----\n';

console.log('Reformatted key lines:', pem.split('\n').length);

try {
  const app = admin.initializeApp({
    credential: admin.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: pem,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
  console.log('cert() succeeded');
  
  app.options.credential.getAccessToken()
    .then(token => {
      console.log('TOKEN OBTAINED:', token.access_token.substring(0, 30) + '...');
    })
    .catch(err => {
      console.error('Token error:', err.message);
    });
} catch(e) {
  console.error('cert() error:', e.message);
}
setTimeout(() => process.exit(0), 10000);
