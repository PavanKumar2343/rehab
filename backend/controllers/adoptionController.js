const { collections, getDocById, queryDocs, toDocs } = require('../config/collections');
const { sendToUser } = require('../config/socket');

exports.submitAdoptionRequest = async (req, res) => {
  try {
    const { animalId, message, contactPhone } = req.body;

    if (!animalId || !message || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Please provide animalId, message, and contact phone' });
    }

    const animal = await getDocById(collections.animals, animalId);
    if (!animal) {
      return res.status(404).json({ success: false, message: 'Animal not found' });
    }

    if (animal.healthStatus !== 'Available For Adoption') {
      return res.status(400).json({ success: false, message: 'This animal is not currently available for adoption' });
    }

    if (!animal.assignedShelter) {
      return res.status(400).json({ success: false, message: 'This animal is not hosted by a shelter yet' });
    }

    const allAdoptions = await toDocs(await collections.adoptionRequests.get());
    const existingRequest = allAdoptions.find(a =>
      a.animalId === animalId &&
      a.userId === req.user.id &&
      a.status === 'Pending'
    );
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending adoption request for this animal' });
    }

    const adoptionData = {
      animalId,
      userId: req.user.id,
      shelterId: animal.assignedShelter,
      status: 'Pending',
      message,
      contactPhone,
      createdAt: new Date().toISOString()
    };
    const adoptionRef = await collections.adoptionRequests.add(adoptionData);

    const shelterDoc = await getDocById(collections.shelters, animal.assignedShelter);
    if (shelterDoc && shelterDoc.userId) {
      const notificationData = {
        recipientId: shelterDoc.userId,
        title: 'New Adoption Application',
        message: `${req.user.name} has applied to adopt ${animal.category} (ID: ${animalId.slice(-4)}).`,
        type: 'Adoption',
        relatedId: adoptionRef.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      const notifRef = await collections.notifications.add(notificationData);

      sendToUser(shelterDoc.userId.toString(), 'new_adoption_application', {
        notification: { id: notifRef.id, ...notificationData },
        adoptionRequest: { id: adoptionRef.id, ...adoptionData }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Adoption request submitted successfully',
      data: { id: adoptionRef.id, ...adoptionData }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyAdoptionRequests = async (req, res) => {
  try {
    const allAdoptions = await toDocs(await collections.adoptionRequests.get());
    const myRequests = allAdoptions.filter(a => a.userId === req.user.id);

    const result = await Promise.all(myRequests.map(async (adopt) => {
      let animal = null;
      if (adopt.animalId) {
        animal = await getDocById(collections.animals, adopt.animalId);
      }
      let shelter = null;
      if (adopt.shelterId) {
        const s = await getDocById(collections.shelters, adopt.shelterId);
        if (s) shelter = { id: s.id, shelterName: s.shelterName, address: s.address };
      }
      return {
        ...adopt,
        id: adopt.id,
        animalId: animal ? { id: animal.id, ...animal } : null,
        shelterId: shelter
      };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getShelterAdoptionRequests = async (req, res) => {
  try {
    const shelter = req.shelter;
    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter details not found' });
    }

    const allAdoptions = await toDocs(await collections.adoptionRequests.get());
    const shelterRequests = allAdoptions.filter(a => a.shelterId === shelter.id);

    const result = await Promise.all(shelterRequests.map(async (adopt) => {
      let animal = null;
      if (adopt.animalId) {
        animal = await getDocById(collections.animals, adopt.animalId);
      }
      let user = null;
      if (adopt.userId) {
        const u = await getDocById(collections.users, adopt.userId);
        if (u) user = { id: u.id, name: u.name, email: u.email, phone: u.phone };
      }
      return {
        ...adopt,
        id: adopt.id,
        animalId: animal ? { id: animal.id, ...animal } : null,
        userId: user
      };
    }));

    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const shelter = req.shelter;

    if (!shelter) {
      return res.status(404).json({ success: false, message: 'Shelter details not found' });
    }

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Please provide a status of Approved or Rejected' });
    }

    const adoptionSnap = await collections.adoptionRequests.doc(req.params.id).get();
    if (!adoptionSnap.exists) {
      return res.status(404).json({ success: false, message: 'Adoption request not found' });
    }
    const adoptionRequest = { id: adoptionSnap.id, ...adoptionSnap.data() };

    if (adoptionRequest.shelterId !== shelter.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this request' });
    }

    if (adoptionRequest.status !== 'Pending') {
      return res.status(400).json({ success: false, message: `Adoption request already ${adoptionRequest.status}` });
    }

    await collections.adoptionRequests.doc(adoptionRequest.id).update({ status });

    const animal = adoptionRequest.animalId ? await getDocById(collections.animals, adoptionRequest.animalId) : null;

    if (status === 'Approved') {
      if (animal) {
        await collections.animals.doc(adoptionRequest.animalId).update({ healthStatus: 'Adopted' });
      }

      if (adoptionRequest.animalId) {
        const allRescues = await toDocs(await collections.rescueRequests.get());
        const rescueRequest = allRescues.find(r => r.animalId === adoptionRequest.animalId);
        if (rescueRequest) {
          const logs = rescueRequest.logs || [];
          logs.push({
            status: 'Adopted',
            timestamp: new Date().toISOString(),
            remarks: `Animal adopted by user ${adoptionRequest.userId.slice(-4)}. Application approved.`,
            photo: null
          });
          await collections.rescueRequests.doc(rescueRequest.id).update({
            status: 'Adopted',
            logs
          });
        }
      }

      const allAdoptions = await toDocs(await collections.adoptionRequests.get());
      const pendingSameAnimal = allAdoptions.filter(a =>
        a.animalId === adoptionRequest.animalId &&
        a.id !== adoptionRequest.id &&
        a.status === 'Pending'
      );
      for (const other of pendingSameAnimal) {
        await collections.adoptionRequests.doc(other.id).update({ status: 'Rejected' });
      }
    }

    const notificationData = {
      recipientId: adoptionRequest.userId,
      title: `Adoption Request ${status}`,
      message: `Your request to adopt the ${animal ? animal.category : 'animal'} has been ${status.toLowerCase()} by ${shelter.shelterName}.`,
      type: 'Adoption',
      relatedId: adoptionRequest.id,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    const notifRef = await collections.notifications.add(notificationData);

    sendToUser(adoptionRequest.userId.toString(), 'adoption_update', {
      notification: { id: notifRef.id, ...notificationData },
      adoptionRequest: { ...adoptionRequest, status },
      status
    });

    res.status(200).json({
      success: true,
      message: `Adoption application ${status.toLowerCase()} successfully`,
      data: { ...adoptionRequest, status }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
