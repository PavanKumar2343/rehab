const dotenv = require('dotenv');
const path = require('path');

// Load environment variables before requiring firebase config
dotenv.config({ path: path.join(__dirname, '.env') });

const { auth } = require('./config/firebase');
const { collections, queryDocs } = require('./config/collections');

const createAdmin = async () => {
  try {
    const name = 'Platform Admin';
    const email = 'admin1@gmail.com';
    const password = '123456';
    const phone = '+10000000000';
    const adminCode = 'ADMIN-001';

    console.log(`Checking if user ${email} exists...`);
    
    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
      console.log('User already exists in Firebase Auth.');
    } catch (error) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/user-not-found') {
        userRecord = await auth.createUser({
          email,
          password,
          displayName: name
        });
        console.log('User created in Firebase Auth.');
      } else {
        throw error;
      }
    }

    const userData = {
      name,
      email,
      phone,
      role: 'admin',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    
    // Check if user document exists in Firestore
    const userDoc = await collections.users.doc(userRecord.uid).get();
    if (!userDoc.exists) {
        await collections.users.doc(userRecord.uid).set(userData);
        console.log('User data added to Firestore users collection.');
    } else {
        await collections.users.doc(userRecord.uid).update({ role: 'admin' });
        console.log('User data updated in Firestore users collection.');
    }

    const admins = await queryDocs(collections.admins, 'userId', '==', userRecord.uid);
    if (admins.length === 0) {
      const adminData = {
        userId: userRecord.uid,
        adminCode,
        createdAt: new Date().toISOString()
      };
      await collections.admins.add(adminData);
      console.log('Admin data added to Firestore admins collection.');
    } else {
      console.log('Admin record already exists in Firestore.');
    }

    console.log('Admin registration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
