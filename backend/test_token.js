require('dotenv').config();
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const app = admin.initializeApp({
  credential: admin.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL
  })
});

// Try to get an access token explicitly
app.options.credential.getAccessToken()
  .then(token => {
    console.log('Access token obtained:', token.access_token.substring(0, 30) + '...');
    console.log('Expires in:', token.expires_in);
    
    // Use token to call Firestore REST API
    const https = require('https');
    const url = 'firestore.googleapis.com';
    const path = '/v1/projects/' + process.env.FIREBASE_PROJECT_ID + '/databases/(default)/documents';
    const options = {
      hostname: url,
      path: path,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + token.access_token }
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode, res.statusMessage);
        console.log('Body:', data.substring(0, 500));
      });
    });
    req.on('error', e => console.error('Request error:', e.message));
    req.end();
  })
  .catch(err => {
    console.error('Token error:', err.message);
    console.error('Full error:', JSON.stringify(err));
  });

setTimeout(() => process.exit(0), 15000);
