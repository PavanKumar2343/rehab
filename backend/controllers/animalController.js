const { collections, addDoc, getDocById, queryDocs, toDoc, toDocs, updateDoc, Timestamp } = require('../config/collections');
const { sendToUser, sendToRoom } = require('../config/socket');

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

exports.reportAnimal = async (req, res) => {
  try {
    const { category, description, longitude, latitude } = req.body;

    if (!category || !description || !longitude || !latitude) {
      return res.status(400).json({ success: false, message: 'Please provide category, description, and GPS coordinates' });
    }

    const lng = parseFloat(longitude);
    const lat = parseFloat(latitude);

    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        photos.push(file.path || `/uploads/${file.filename}`);
      });
    }

    const animalData = {
      category,
      description,
      healthStatus: 'Reported',
      photos,
      location: {
        type: 'Point',
        coordinates: [lng, lat]
      },
      reportedBy: req.user.id,
      assignedShelter: null,
      createdAt: new Date().toISOString()
    };
    const animalRef = await collections.animals.add(animalData);

    const rescueLog = {
      status: 'Reported',
      timestamp: new Date().toISOString(),
      remarks: 'Injured animal reported in system',
      photo: photos[0] || null
    };

    const rescueData = {
      animalId: animalRef.id,
      reporterId: req.user.id,
      assignedShelterId: null,
      status: 'Reported',
      rejectedBy: [],
      logs: [rescueLog],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const rescueRef = await collections.rescueRequests.add(rescueData);

    const approvedShelters = await queryDocs(collections.shelters, 'status', '==', 'Approved');
    const notifiedShelters = [];

    for (const shelter of approvedShelters) {
      if (!shelter.location || !shelter.location.coordinates) continue;

      const sLng = shelter.location.coordinates[0];
      const sLat = shelter.location.coordinates[1];
      const distance = getDistanceInKm(lat, lng, sLat, sLng);

      if (distance <= (shelter.radiusPreferenceKm || 10)) {
        notifiedShelters.push({
          shelterId: shelter.id,
          name: shelter.shelterName,
          distance
        });

        if (shelter.userId) {
          const notificationData = {
            recipientId: shelter.userId,
            title: 'New Injured Animal Reported Nearby',
            message: `A ${category} is reported ${distance} km from your location. Needs assistance!`,
            type: 'Rescue',
            relatedId: rescueRef.id,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          const notifRef = await collections.notifications.add(notificationData);

          sendToUser(shelter.userId.toString(), 'new_rescue_request', {
            notification: { id: notifRef.id, ...notificationData },
            rescueRequest: {
              ...rescueData,
              id: rescueRef.id,
              animalId: { id: animalRef.id, ...animalData }
            },
            distance
          });
        }
      }
    }

    const adminNotif = {
      title: 'New Animal Report',
      message: `A new ${category} has been reported.`,
      relatedId: rescueRef.id,
      type: 'Rescue'
    };
    sendToRoom('admins', 'new_rescue_report_admin', adminNotif);

    res.status(201).json({
      success: true,
      data: {
        animal: { id: animalRef.id, ...animalData },
        rescueRequest: { id: rescueRef.id, ...rescueData },
        notifiedShelters
      }
    });
  } catch (error) {
    console.error('Error reporting animal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnimals = async (req, res) => {
  try {
    const { status, category } = req.query;

    let allAnimals = await toDocs(await collections.animals.get());
    let filtered = allAnimals;

    if (status) {
      filtered = filtered.filter(a => a.healthStatus === status);
    }
    if (category) {
      filtered = filtered.filter(a => a.category === category);
    }

    const result = await Promise.all(filtered.map(async (animal) => {
      let reportedBy = null;
      if (animal.reportedBy) {
        const u = await getDocById(collections.users, animal.reportedBy);
        if (u) reportedBy = { id: u.id, name: u.name, phone: u.phone, profilePhoto: u.profilePhoto };
      }
      let assignedShelter = null;
      if (animal.assignedShelter) {
        const s = await getDocById(collections.shelters, animal.assignedShelter);
        if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address, location: s.location };
      }
      return { id: animal.id, ...animal, reportedBy, assignedShelter };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAdoptableAnimals = async (req, res) => {
  try {
    const allAnimals = await toDocs(await collections.animals.get());
    const adoptable = allAnimals.filter(a => a.healthStatus === 'Available For Adoption');

    const result = await Promise.all(adoptable.map(async (animal) => {
      let reportedBy = null;
      if (animal.reportedBy) {
        const u = await getDocById(collections.users, animal.reportedBy);
        if (u) reportedBy = { id: u.id, name: u.name, phone: u.phone };
      }
      let assignedShelter = null;
      if (animal.assignedShelter) {
        const s = await getDocById(collections.shelters, animal.assignedShelter);
        if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address, location: s.location };
      }
      return { id: animal.id, ...animal, reportedBy, assignedShelter };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnimalById = async (req, res) => {
  try {
    const animal = await getDocById(collections.animals, req.params.id);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }

    let reportedBy = null;
    if (animal.reportedBy) {
      const u = await getDocById(collections.users, animal.reportedBy);
      if (u) reportedBy = { id: u.id, name: u.name, email: u.email, phone: u.phone, profilePhoto: u.profilePhoto };
    }
    let assignedShelter = null;
    if (animal.assignedShelter) {
      const s = await getDocById(collections.shelters, animal.assignedShelter);
      if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address, location: s.location };
    }

    res.status(200).json({ success: true, data: { id: animal.id, ...animal, reportedBy, assignedShelter } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyReports = async (req, res) => {
  try {
    const allAnimals = await toDocs(await collections.animals.get());
    const myReports = allAnimals.filter(a => a.reportedBy === req.user.id);

    const result = await Promise.all(myReports.map(async (animal) => {
      let assignedShelter = null;
      if (animal.assignedShelter) {
        const s = await getDocById(collections.shelters, animal.assignedShelter);
        if (s) assignedShelter = { id: s.id, shelterName: s.shelterName, address: s.address };
      }
      return { id: animal.id, ...animal, assignedShelter };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadAnimalForAdoption = async (req, res) => {
  try {
    const { category, description, age, gender, name } = req.body;

    if (!category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide category and description' });
    }

    const photos = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        photos.push(file.path || `/uploads/${file.filename}`);
      });
    }

    // Get the shelter associated with the current user
    const shelters = await queryDocs(collections.shelters, 'userId', '==', req.user.id);
    if (shelters.length === 0) {
      return res.status(400).json({ success: false, message: 'No shelter found for this user' });
    }
    const shelter = shelters[0];

    const animalData = {
      category,
      description,
      name: name || category,
      age: age || null,
      gender: gender || null,
      healthStatus: 'Available For Adoption',
      photos,
      location: shelter.location,
      reportedBy: req.user.id,
      assignedShelter: shelter.id,
      createdAt: new Date().toISOString()
    };
    const animalRef = await collections.animals.add(animalData);

    res.status(201).json({
      success: true,
      data: { id: animalRef.id, ...animalData }
    });
  } catch (error) {
    console.error('Error uploading animal:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
