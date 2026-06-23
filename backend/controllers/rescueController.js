const { collections, getDocById, queryDocs, toDocs, Timestamp } = require('../config/collections');
const { sendToUser } = require('../config/socket');

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

exports.getIncomingRescues = async (req, res) => {
  try {
    const shelter = req.shelter;
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter profile not found' });
    }

    if (shelter.status !== 'Approved') {
      return res.status(403).json({ success: false, message: 'Shelter account is pending admin approval' });
    }

    const allRescues = await toDocs(await collections.rescueRequests.get());
    const reported = allRescues.filter(r =>
      r.status === 'Reported' &&
      !r.assignedShelterId &&
      (!r.rejectedBy || !r.rejectedBy.includes(shelter.id))
    );

    const sLng = shelter.location.coordinates[0];
    const sLat = shelter.location.coordinates[1];

    const result = [];
    for (const rescue of reported) {
      if (!rescue.animalId) continue;
      const animal = await getDocById(collections.animals, rescue.animalId);
      if (!animal || !animal.location || !animal.location.coordinates) continue;

      const aLng = animal.location.coordinates[0];
      const aLat = animal.location.coordinates[1];
      const distance = getDistanceInKm(sLat, sLng, aLat, aLng);

      if (distance <= (shelter.radiusPreferenceKm || 10)) {
        let reporter = null;
        if (rescue.reporterId) {
          const u = await getDocById(collections.users, rescue.reporterId);
          if (u) reporter = { id: u.id, name: u.name, phone: u.phone, profilePhoto: u.profilePhoto };
        }
        result.push({
          ...rescue,
          id: rescue.id,
          animalId: { id: animal.id, ...animal },
          reporterId: reporter,
          distance
        });
      }
    }

    result.sort((a, b) => a.distance - b.distance);

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveRescues = async (req, res) => {
  try {
    const shelter = req.shelter;
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter profile not found' });
    }

    const allRescues = await toDocs(await collections.rescueRequests.get());
    const active = allRescues.filter(r =>
      r.assignedShelterId === shelter.id &&
      r.status !== 'Adopted'
    );

    const result = await Promise.all(active.map(async (rescue) => {
      let animal = null;
      if (rescue.animalId) {
        animal = await getDocById(collections.animals, rescue.animalId);
      }
      let reporter = null;
      if (rescue.reporterId) {
        const u = await getDocById(collections.users, rescue.reporterId);
        if (u) reporter = { id: u.id, name: u.name, phone: u.phone };
      }
      return {
        ...rescue,
        id: rescue.id,
        animalId: animal ? { id: animal.id, ...animal } : null,
        reporterId: reporter
      };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.acceptRescue = async (req, res) => {
  try {
    const shelter = req.shelter;
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter profile not found' });
    }

    if (shelter.status !== 'Approved') {
      return res.status(403).json({ success: false, message: 'Shelter is not verified by admin' });
    }

    const rescueSnap = await collections.rescueRequests.doc(req.params.id).get();
    if (!rescueSnap.exists) {
      return res.status(404).json({ success: false, message: 'Rescue request not found' });
    }
    const rescueRequest = { id: rescueSnap.id, ...rescueSnap.data() };

    if (rescueRequest.assignedShelterId) {
      return res.status(400).json({ success: false, message: 'Rescue request already accepted by another shelter' });
    }

    await collections.rescueRequests.doc(rescueRequest.id).update({
      assignedShelterId: shelter.id,
      status: 'Rescue Accepted',
      updatedAt: new Date().toISOString(),
      logs: [
        ...(rescueRequest.logs || []),
        {
          status: 'Rescue Accepted',
          timestamp: new Date().toISOString(),
          remarks: `Rescue accepted by ${shelter.shelterName}. Dispatching team.`,
          photo: null
        }
      ]
    });

    if (rescueRequest.animalId) {
      const animal = await getDocById(collections.animals, rescueRequest.animalId);
      if (animal) {
        await collections.animals.doc(rescueRequest.animalId).update({
          healthStatus: 'Rescue Accepted',
          assignedShelter: shelter.id
        });
      }
    }

    if (rescueRequest.reporterId) {
      const animal = rescueRequest.animalId ? await getDocById(collections.animals, rescueRequest.animalId) : null;
      const notificationData = {
        recipientId: rescueRequest.reporterId,
        title: 'Rescue Request Accepted',
        message: `Your report of a ${animal ? animal.category : 'animal'} was accepted by ${shelter.shelterName}. They are on their way!`,
        type: 'Rescue',
        relatedId: rescueRequest.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      const notifRef = await collections.notifications.add(notificationData);

      sendToUser(rescueRequest.reporterId.toString(), 'rescue_update', {
        notification: { id: notifRef.id, ...notificationData },
        rescueRequest: { ...rescueRequest, status: 'Rescue Accepted' },
        status: 'Rescue Accepted'
      });
    }

    res.status(200).json({ success: true, message: 'Rescue request accepted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectRescue = async (req, res) => {
  try {
    const shelter = req.shelter;
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter profile not found' });
    }

    const rescueSnap = await collections.rescueRequests.doc(req.params.id).get();
    if (!rescueSnap.exists) {
      return res.status(404).json({ success: false, message: 'Rescue request not found' });
    }
    const rescueRequest = { id: rescueSnap.id, ...rescueSnap.data() };

    const rejectedBy = rescueRequest.rejectedBy || [];
    if (!rejectedBy.includes(shelter.id)) {
      rejectedBy.push(shelter.id);
      await collections.rescueRequests.doc(rescueRequest.id).update({
        rejectedBy,
        updatedAt: new Date().toISOString()
      });
    }

    res.status(200).json({ success: true, message: 'Rescue request rejected/hidden' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRescueStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const shelter = req.shelter;

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter profile not found' });
    }

    const rescueSnap = await collections.rescueRequests.doc(req.params.id).get();
    if (!rescueSnap.exists) {
      return res.status(404).json({ success: false, message: 'Rescue request not found' });
    }
    const rescueRequest = { id: rescueSnap.id, ...rescueSnap.data() };

    if (rescueRequest.assignedShelterId !== shelter.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this rescue request' });
    }

    const validStatuses = ['Rescue Accepted', 'Rescued', 'Under Treatment', 'Recovered', 'Available For Adoption', 'Adopted'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status update' });
    }

    let photoUrl = null;
    if (req.file) {
      photoUrl = req.file.path;
    }

    const logs = rescueRequest.logs || [];
    logs.push({
      status,
      timestamp: new Date().toISOString(),
      remarks: remarks || `Status updated to: ${status}`,
      photo: photoUrl
    });

    await collections.rescueRequests.doc(rescueRequest.id).update({
      status,
      logs,
      updatedAt: new Date().toISOString()
    });

    if (rescueRequest.animalId) {
      const animal = await getDocById(collections.animals, rescueRequest.animalId);
      if (animal) {
        const updateData = { healthStatus: status };
        if (photoUrl) {
          const currentPhotos = animal.photos || [];
          currentPhotos.push(photoUrl);
          updateData.photos = currentPhotos;
        }
        await collections.animals.doc(rescueRequest.animalId).update(updateData);
      }
    }

    if (rescueRequest.reporterId) {
      const animal = rescueRequest.animalId ? await getDocById(collections.animals, rescueRequest.animalId) : null;
      const notificationData = {
        recipientId: rescueRequest.reporterId,
        title: 'Rescue Progress Updated',
        message: `The status of your reported ${animal ? animal.category : 'animal'} was updated to: ${status}.`,
        type: 'Rescue',
        relatedId: rescueRequest.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      const notifRef = await collections.notifications.add(notificationData);

      sendToUser(rescueRequest.reporterId.toString(), 'rescue_update', {
        notification: { id: notifRef.id, ...notificationData },
        rescueRequest: { ...rescueRequest, status, logs },
        status
      });
    }

    res.status(200).json({ success: true, data: { ...rescueRequest, status, logs } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRescueById = async (req, res) => {
  try {
    const rescue = await rescueSnapToObj(req.params.id);
    if (!rescue) {
      return res.status(404).json({ success: false, message: 'Rescue request not found' });
    }

    const isReporter = rescue.reporterId?.id === req.user.id;
    const isShelter = req.shelter && rescue.assignedShelterId?.id === req.shelter.id;
    const isAdmin = req.user.role === 'admin';

    if (!isReporter && !isShelter && !isAdmin) {
      let isNearIncoming = false;
      if (req.shelter && rescue.status === 'Reported' && !rescue.assignedShelterId) {
        const sLng = req.shelter.location.coordinates[0];
        const sLat = req.shelter.location.coordinates[1];
        if (rescue.animalId?.location?.coordinates) {
          const aLng = rescue.animalId.location.coordinates[0];
          const aLat = rescue.animalId.location.coordinates[1];
          const distance = getDistanceInKm(sLat, sLng, aLat, aLng);
          if (distance <= req.shelter.radiusPreferenceKm) {
            isNearIncoming = true;
          }
        }
      }
      if (!isNearIncoming) {
        return res.status(403).json({ success: false, message: 'Not authorized to view this rescue' });
      }
    }

    res.status(200).json({ success: true, data: rescue });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyRescueHistory = async (req, res) => {
  try {
    const allRescues = await toDocs(await collections.rescueRequests.get());
    const myRescues = allRescues.filter(r => r.reporterId === req.user.id);

    const result = await Promise.all(myRescues.map(async (rescue) => {
      let animal = null;
      if (rescue.animalId) {
        animal = await getDocById(collections.animals, rescue.animalId);
      }
      return { ...rescue, id: rescue.id, animalId: animal ? { id: animal.id, ...animal } : null };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

async function rescueSnapToObj(id) {
  const rescueSnap = await collections.rescueRequests.doc(id).get();
  if (!rescueSnap.exists) return null;
  const rescue = { id: rescueSnap.id, ...rescueSnap.data() };

  let animal = null;
  if (rescue.animalId) {
    animal = await getDocById(collections.animals, rescue.animalId);
  }

  let reporter = null;
  if (rescue.reporterId) {
    const u = await getDocById(collections.users, rescue.reporterId);
    if (u) reporter = { id: u.id, name: u.name, phone: u.phone, email: u.email };
  }

  let assignedShelter = null;
  if (rescue.assignedShelterId) {
    const s = await getDocById(collections.shelters, rescue.assignedShelterId);
    if (s) {
      let userInfo = null;
      if (s.userId) {
        const u = await getDocById(collections.users, s.userId);
        if (u) userInfo = { id: u.id, name: u.name, phone: u.phone };
      }
      assignedShelter = { id: s.id, ...s, userId: userInfo };
    }
  }

  return {
    ...rescue,
    animalId: animal ? { id: animal.id, ...animal } : null,
    reporterId: reporter,
    assignedShelterId: assignedShelter
  };
}
