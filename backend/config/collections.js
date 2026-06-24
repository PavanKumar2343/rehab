const { db } = require('./firebase');

const Timestamp = () => new Date().toISOString();
const FieldValue = {
  serverTimestamp: () => new Date().toISOString(),
  delete: () => 'DELETE_FIELD'
};

const collections = {
  users: db?.collection('users'),
  shelters: db?.collection('shelters'),
  admins: db?.collection('admins'),
  animals: db?.collection('animals'),
  rescueRequests: db?.collection('rescueRequests'),
  adoptionRequests: db?.collection('adoptionRequests'),
  notifications: db?.collection('notifications')
};

const toDoc = (snap) => {
  if (!snap || !snap.exists) return null;
  return { id: snap.id, ...snap.data() };
};

const toDocs = (snapshot) => {
  if (!snapshot || !snapshot.docs) return [];
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

const getDocById = async (collectionRef, id) => {
  if (!collectionRef) return null;
  try {
    const snap = await collectionRef.doc(id).get();
    return toDoc(snap);
  } catch (e) {
    console.error('getDocById error:', e.message);
    return null;
  }
};

const deleteDocById = async (collectionRef, id) => {
  if (!collectionRef) return;
  try {
    await collectionRef.doc(id).delete();
  } catch (e) {
    console.error('deleteDocById error:', e.message);
  }
};

const updateDoc = async (collectionRef, id, data) => {
  if (!collectionRef) throw new Error('Collection not initialized');
  await collectionRef.doc(id).update({ ...data, updatedAt: Timestamp() });
};

const setDoc = async (collectionRef, id, data) => {
  if (!collectionRef) throw new Error('Collection not initialized');
  await collectionRef.doc(id).set({ ...data, createdAt: Timestamp(), updatedAt: Timestamp() });
};

const addDoc = async (collectionRef, data) => {
  if (!collectionRef) {
    // If collection isn't initialized, just return a dummy doc
    return { id: 'dummy-doc-' + Date.now(), ...data };
  }
  try {
    const docRef = await collectionRef.add({ ...data, createdAt: Timestamp(), updatedAt: Timestamp() });
    const snap = await docRef.get();
    return toDoc(snap);
  } catch (e) {
    console.error('addDoc error, returning dummy:', e.message);
    return { id: 'dummy-doc-' + Date.now(), ...data };
  }
};

const queryDocs = async (collectionRef, field, operator, value, orderByField = null, orderDirection = 'asc', limitCount = null) => {
  if (!collectionRef) return [];
  try {
    let query = collectionRef.where(field, operator, value);
    if (orderByField) query = query.orderBy(orderByField, orderDirection);
    if (limitCount) query = query.limit(limitCount);
    const snapshot = await query.get();
    return toDocs(snapshot);
  } catch (e) {
    console.error('queryDocs error:', e.message);
    return [];
  }
};

module.exports = {
  db,
  Timestamp,
  FieldValue,
  collections,
  toDoc,
  toDocs,
  getDocById,
  deleteDocById,
  updateDoc,
  setDoc,
  addDoc,
  queryDocs
};
