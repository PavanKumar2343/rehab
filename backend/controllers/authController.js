const { auth: firebaseAuth } = require('../config/firebase');
const { collections, queryDocs } = require('../config/collections');

const https = require('https');

const firebaseSignInWithPassword = (email, password) => {
  return new Promise((resolve, reject) => {
    const apiKey = process.env.FIREBASE_API_KEY;
    const data = JSON.stringify({ email, password, returnSecureToken: true });

    const options = {
      hostname: 'identitytoolkit.googleapis.com',
      path: `/v1/accounts:signInWithPassword?key=${apiKey}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('Failed to parse Firebase response'));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUsers = await queryDocs(collections.users, 'email', '==', email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    const userData = {
      name,
      email,
      phone,
      role: 'user',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(userData);

    const firebaseResult = await firebaseSignInWithPassword(email, password);
    const idToken = firebaseResult.idToken;

    res.status(201).json({
      success: true,
      token: idToken,
      user: { id: userRecord.uid, name, email, phone, role: 'user' }
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerShelter = async (req, res) => {
  try {
    const { name, email, password, phone, shelterName, licenseNumber, address, longitude, latitude, radiusPreferenceKm } = req.body;

    const existingUsers = await queryDocs(collections.users, 'email', '==', email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const existingLicenses = await queryDocs(collections.shelters, 'licenseNumber', '==', licenseNumber);
    if (existingLicenses.length > 0) {
      return res.status(400).json({ success: false, message: 'License number already registered' });
    }

    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    const userData = {
      name,
      email,
      phone,
      role: 'shelter',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(userData);

    const shelterData = {
      userId: userRecord.uid,
      shelterName,
      licenseNumber,
      address,
      location: {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)]
      },
      radiusPreferenceKm: radiusPreferenceKm ? parseInt(radiusPreferenceKm) : 10,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    const shelterRef = await collections.shelters.add(shelterData);

    const firebaseResult = await firebaseSignInWithPassword(email, password);
    const idToken = firebaseResult.idToken;

    res.status(201).json({
      success: true,
      token: idToken,
      user: {
        id: userRecord.uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        shelter: {
          id: shelterRef.id,
          shelterName,
          licenseNumber,
          address,
          coordinates: [parseFloat(longitude), parseFloat(latitude)],
          status: 'Pending',
          radiusPreferenceKm: shelterData.radiusPreferenceKm
        }
      }
    });
  } catch (error) {
    console.error('Shelter register error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password, phone, secretKey, adminCode } = req.body;

    if (secretKey !== process.env.ADMIN_REGISTRATION_SECRET) {
      return res.status(403).json({ success: false, message: 'Invalid admin registration secret key' });
    }

    const existingUsers = await queryDocs(collections.users, 'email', '==', email);
    if (existingUsers.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const existingCodes = await queryDocs(collections.admins, 'adminCode', '==', adminCode);
    if (existingCodes.length > 0) {
      return res.status(400).json({ success: false, message: 'Admin code already exists' });
    }

    const userRecord = await firebaseAuth.createUser({
      email,
      password,
      displayName: name
    });

    const userData = {
      name,
      email,
      phone,
      role: 'admin',
      profilePhoto: '',
      firebaseUid: userRecord.uid,
      createdAt: new Date().toISOString()
    };
    await collections.users.doc(userRecord.uid).set(userData);

    const adminData = {
      userId: userRecord.uid,
      adminCode,
      createdAt: new Date().toISOString()
    };
    await collections.admins.add(adminData);

    const firebaseResult = await firebaseSignInWithPassword(email, password);
    const idToken = firebaseResult.idToken;

    res.status(201).json({
      success: true,
      token: idToken,
      user: {
        id: userRecord.uid,
        name,
        email,
        phone,
        role: 'admin',
        adminCode
      }
    });
  } catch (error) {
    console.error('Admin register error:', error);
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const firebaseResult = await firebaseSignInWithPassword(email, password);

    if (firebaseResult.error) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const idToken = firebaseResult.idToken;
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const users = await queryDocs(collections.users, 'firebaseUid', '==', uid);
    let user;
    if (users.length > 0) {
      user = users[0];
    } else {
      const userByEmail = await queryDocs(collections.users, 'email', '==', email);
      if (userByEmail.length > 0) {
        user = userByEmail[0];
        await collections.users.doc(user.id).update({ firebaseUid: uid });
      } else {
        return res.status(401).json({ success: false, message: 'User not found in database' });
      }
    }

    let roleData = {};
    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', user.id);
      if (shelters.length > 0) {
        const shelter = shelters[0];
        roleData.shelter = {
          id: shelter.id,
          shelterName: shelter.shelterName,
          licenseNumber: shelter.licenseNumber,
          address: shelter.address,
          coordinates: shelter.location?.coordinates,
          status: shelter.status,
          radiusPreferenceKm: shelter.radiusPreferenceKm
        };
      }
    } else if (user.role === 'admin') {
      const admins = await queryDocs(collections.admins, 'userId', '==', user.id);
      if (admins.length > 0) {
        roleData.adminCode = admins[0].adminCode;
      }
    }

    res.status(200).json({
      success: true,
      token: idToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto || '',
        ...roleData
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userSnap = await collections.users.doc(req.user.id).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = { id: userSnap.id, ...userSnap.data() };

    let roleData = {};

    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', req.user.id);
      if (shelters.length > 0) {
        const shelter = shelters[0];
        roleData.shelter = {
          id: shelter.id,
          shelterName: shelter.shelterName,
          licenseNumber: shelter.licenseNumber,
          address: shelter.address,
          coordinates: shelter.location?.coordinates,
          status: shelter.status,
          radiusPreferenceKm: shelter.radiusPreferenceKm
        };
      }
    } else if (user.role === 'admin') {
      const admins = await queryDocs(collections.admins, 'userId', '==', req.user.id);
      if (admins.length > 0) {
        roleData.adminCode = admins[0].adminCode;
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto || '',
        ...roleData
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, shelterName, address, radiusPreferenceKm } = req.body;
    const userId = req.user.id;

    const userFields = {};
    if (name) userFields.name = name;
    if (phone) userFields.phone = phone;

    if (req.file) {
      userFields.profilePhoto = req.file.path;
    }

    if (Object.keys(userFields).length > 0) {
      await collections.users.doc(userId).update(userFields);
    }

    const userSnap = await collections.users.doc(userId).get();
    const updatedUser = { id: userSnap.id, ...userSnap.data() };

    let updatedShelter = null;
    if (updatedUser.role === 'shelter') {
      const shelterFields = {};
      if (shelterName) shelterFields.shelterName = shelterName;
      if (address) shelterFields.address = address;
      if (radiusPreferenceKm) shelterFields.radiusPreferenceKm = parseInt(radiusPreferenceKm);

      if (Object.keys(shelterFields).length > 0) {
        const shelters = await queryDocs(collections.shelters, 'userId', '==', userId);
        if (shelters.length > 0) {
          await collections.shelters.doc(shelters[0].id).update(shelterFields);
          updatedShelter = { ...shelters[0], ...shelterFields };
        }
      }
    }

    res.status(200).json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        profilePhoto: updatedUser.profilePhoto || '',
        shelter: updatedShelter ? {
          id: updatedShelter.id,
          shelterName: updatedShelter.shelterName,
          licenseNumber: updatedShelter.licenseNumber,
          address: updatedShelter.address,
          coordinates: updatedShelter.location?.coordinates,
          status: updatedShelter.status,
          radiusPreferenceKm: updatedShelter.radiusPreferenceKm
        } : undefined
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
