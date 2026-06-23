const { collections, getDocById, queryDocs, toDocs } = require('../config/collections');

exports.getShelters = async (req, res) => {
  try {
    const approvedShelters = await queryDocs(collections.shelters, 'status', '==', 'Approved');
    const result = approvedShelters.map(s => ({
      id: s.id,
      shelterName: s.shelterName,
      address: s.address,
      location: s.location,
      radiusPreferenceKm: s.radiusPreferenceKm
    }));
    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShelterById = async (req, res) => {
  try {
    const shelter = await getDocById(collections.shelters, req.params.id);
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter not found' });
    }
    let user = null;
    if (shelter.userId) {
      user = await getDocById(collections.users, shelter.userId);
    }
    res.status(200).json({
      success: true,
      data: {
        id: shelter.id,
        shelterName: shelter.shelterName,
        address: shelter.address,
        location: shelter.location,
        radiusPreferenceKm: shelter.radiusPreferenceKm,
        status: shelter.status,
        licenseNumber: shelter.licenseNumber,
        user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNearbyShelters = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance } = req.query;
    if (!longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Please provide longitude and latitude' });
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDist = parseFloat(maxDistance) || 20;

    const getDistanceInKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return parseFloat((R * c).toFixed(2));
    };

    const approvedShelters = await queryDocs(collections.shelters, 'status', '==', 'Approved');
    const nearby = approvedShelters
      .filter(s => s.location && s.location.coordinates)
      .map(s => ({
        id: s.id,
        shelterName: s.shelterName,
        address: s.address,
        coordinates: s.location.coordinates,
        distance: getDistanceInKm(lat, lng, s.location.coordinates[1], s.location.coordinates[0])
      }))
      .filter(s => s.distance <= maxDist)
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json({ success: true, count: nearby.length, data: nearby });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRadiusPreference = async (req, res) => {
  try {
    const shelter = req.shelter;
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter profile not found' });
    }

    const { radius } = req.body;
    if (!radius || radius < 1) {
      return res.status(400).json({ success: false, message: 'Please provide a valid radius (minimum 1 km)' });
    }

    await collections.shelters.doc(shelter.id).update({ radiusPreferenceKm: parseInt(radius) });

    res.status(200).json({ success: true, message: `Dispatch radius updated to ${radius} km` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
