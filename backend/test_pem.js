require('dotenv').config();
const crypto = require('crypto');
const key = process.env.FIREBASE_PRIVATE_KEY;

// Try to create a sign object with the key
try {
  const sign = crypto.createSign('SHA256');
  sign.update('test');
  const sig = sign.sign(key, 'base64');
  console.log('RSA signing succeeded! Signature length:', sig.length);
  
  // Also test verify
  const verify = crypto.createVerify('SHA256');
  verify.update('test');
  // Extract the public key from the private key
  console.log('Private key format works.');
} catch(e) {
  console.error('Signing failed:', e.message);
}

// Try different key formats
// Format 1: raw key with 3 newlines
console.log('\\nFormat 1 (raw):');
let key1 = key;
console.log('  Lines:', key1.split('\\n').length);

// Format 2: properly formatted with 64-char lines
console.log('\\nFormat 2 (64-char lines):');
let b64 = key.replace('-----BEGIN PRIVATE KEY-----\\n', '').replace('\\n-----END PRIVATE KEY-----\\n', '').replace('\\n', '');
let lines = ['-----BEGIN PRIVATE KEY-----'];
for (let i = 0; i < b64.length; i += 64) {
  lines.push(b64.substring(i, i + 64));
}
lines.push('-----END PRIVATE KEY-----');
let key2 = lines.join('\\n') + '\\n';
console.log('  Lines:', key2.split('\\n').length);
console.log('  Length:', key2.length);

// Try signing with format 2
try {
  const sign2 = crypto.createSign('SHA256');
  sign2.update('test');
  const sig2 = sign2.sign(key2, 'base64');
  console.log('Format 2 signing succeeded!');
} catch(e) {
  console.error('Format 2 signing failed:', e.message);
}
