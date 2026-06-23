const { auth } = require('../config/firebase');
const { collections, getDocById, toDoc, queryDocs } = require('../config/collections');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const userSnap = await collections.users.doc(uid).get();
    const user = toDoc(userSnap);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = { ...user, _id: uid, id: uid };
    req.userId = uid;

    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', uid);
      req.shelter = shelters.length > 0 ? { ...shelters[0], _id: shelters[0].id } : null;
    }

    if (user.role === 'admin') {
      const admins = await queryDocs(collections.admins, 'userId', '==', uid);
      req.admin = admins.length > 0 ? { ...admins[0], _id: admins[0].id } : null;
    }

    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this resource`
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };
