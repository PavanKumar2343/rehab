const { collections, getDocById, queryDocs, toDocs } = require('../config/collections');
const { sendToUser } = require('../config/socket');

exports.getUsers = async (req, res) => {
  try {
    const users = await toDocs(await collections.users.get());
    const sorted = users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json({ success: true, count: sorted.length, data: sorted.map(u => ({ id: u.id, ...u })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userSnap = await collections.users.doc(req.params.id).get();
    if (!userSnap.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    const user = { id: userSnap.id, ...userSnap.data() };

    if (user.role === 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot delete admin accounts' });
    }

    if (user.role === 'shelter') {
      const shelters = await queryDocs(collections.shelters, 'userId', '==', req.params.id);
      if (shelters.length > 0) {
        await collections.shelters.doc(shelters[0].id).delete();
      }
    }

    await collections.users.doc(req.params.id).delete();

    try {
      const { auth } = require('../config/firebase');
      await auth.deleteUser(req.params.id);
    } catch (e) {
      console.log('Firebase user may not exist:', e.message);
    }

    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPendingShelters = async (req, res) => {
  try {
    const pending = await queryDocs(collections.shelters, 'status', '==', 'Pending');
    const result = await Promise.all(pending.map(async (s) => {
      let user = null;
      if (s.userId) {
        user = await getDocById(collections.users, s.userId);
      }
      return { id: s.id, ...s, userId: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone, profilePhoto: user.profilePhoto } : null };
    }));
    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSheltersAdmin = async (req, res) => {
  try {
    const shelters = await toDocs(await collections.shelters.get());
    const result = await Promise.all(shelters.map(async (s) => {
      let user = null;
      if (s.userId) {
        user = await getDocById(collections.users, s.userId);
      }
      return { id: s.id, ...s, userId: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone, profilePhoto: user.profilePhoto } : null };
    }));
    res.status(200).json({ success: true, count: result.length, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyShelter = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be Approved or Rejected' });
    }

    const shelterSnap = await collections.shelters.doc(req.params.id).get();
    if (!shelterSnap.exists) {
      return res.status(404).json({ success: false, message: 'Shelter registration not found' });
    }
    const shelter = { id: shelterSnap.id, ...shelterSnap.data() };

    await collections.shelters.doc(shelter.id).update({ status });

    if (shelter.userId) {
      const notificationData = {
        recipientId: shelter.userId,
        title: `Shelter Registration ${status}`,
        message: status === 'Approved'
          ? `Congratulations! Your shelter profile "${shelter.shelterName}" has been verified. You can now accept rescues.`
          : `We regret to inform you that your shelter registration "${shelter.shelterName}" was rejected by administrators.`,
        type: 'Verification',
        relatedId: shelter.id,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      const notifRef = await collections.notifications.add(notificationData);

      sendToUser(shelter.userId.toString(), 'shelter_verification_update', {
        notification: { id: notifRef.id, ...notificationData },
        status
      });
    }

    res.status(200).json({ success: true, message: `Shelter registration set to ${status}`, data: { id: shelter.id, ...shelter, status } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const allUsers = await toDocs(await collections.users.get());
    const usersCount = allUsers.filter(u => u.role === 'user').length;
    const sheltersCount = allUsers.filter(u => u.role === 'shelter').length;
    const adminsCount = allUsers.filter(u => u.role === 'admin').length;

    const allAnimals = await toDocs(await collections.animals.get());

    const healthStatusStats = {
      Reported: 0,
      RescueAccepted: 0,
      Rescued: 0,
      UnderTreatment: 0,
      Recovered: 0,
      AvailableForAdoption: 0,
      Adopted: 0
    };

    allAnimals.forEach(a => {
      const statusKey = (a.healthStatus || '').replace(/\s+/g, '');
      if (healthStatusStats.hasOwnProperty(statusKey)) {
        healthStatusStats[statusKey]++;
      }
    });

    const categoryStats = {};
    allAnimals.forEach(a => {
      categoryStats[a.category] = (categoryStats[a.category] || 0) + 1;
    });

    const allRescues = await toDocs(await collections.rescueRequests.get());
    const totalRescues = allRescues.length;
    const pendingRescues = allRescues.filter(r => r.status === 'Reported').length;
    const activeRescues = allRescues.filter(r => ['Rescue Accepted', 'Rescued', 'Under Treatment'].includes(r.status)).length;
    const recoveredRescues = allRescues.filter(r => ['Recovered', 'Available For Adoption', 'Adopted'].includes(r.status)).length;

    const allAdoptions = await toDocs(await collections.adoptionRequests.get());
    const totalAdoptionsCount = allAdoptions.length;
    const pendingAdoptions = allAdoptions.filter(a => a.status === 'Pending').length;
    const approvedAdoptions = allAdoptions.filter(a => a.status === 'Approved').length;

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: usersCount + sheltersCount + adminsCount,
          normalUsers: usersCount,
          shelters: sheltersCount,
          admins: adminsCount
        },
        animals: {
          total: allAnimals.length,
          healthStatuses: healthStatusStats,
          categories: categoryStats
        },
        rescues: {
          total: totalRescues,
          pending: pendingRescues,
          active: activeRescues,
          recovered: recoveredRescues
        },
        adoptions: {
          total: totalAdoptionsCount,
          pending: pendingAdoptions,
          approved: approvedAdoptions
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generateReport = async (req, res) => {
  try {
    const allUsers = await toDocs(await collections.users.get());
    const allShelters = await toDocs(await collections.shelters.get());
    const allAnimals = await toDocs(await collections.animals.get());

    const usersCount = allUsers.length;
    const approvedShelters = allShelters.filter(s => s.status === 'Approved').length;
    const reportedAnimalsCount = allAnimals.length;
    const adoptedAnimalsCount = allAnimals.filter(a => a.healthStatus === 'Adopted').length;
    const underTreatmentCount = allAnimals.filter(a => a.healthStatus === 'Under Treatment').length;

    const allRescues = await toDocs(await collections.rescueRequests.get());
    const allAdoptions = await toDocs(await collections.adoptionRequests.get());

    const lines = [
      '==================================================',
      '        FAUNARESCUE - PLATFORM GENERAL STATUS      ',
      `        Generated: ${new Date().toLocaleString()}  `,
      '==================================================',
      '',
      '--- USER METRICS ---',
      `Total Registered Users: ${usersCount}`,
      `Total Approved Shelters: ${approvedShelters}`,
      '',
      '--- ANIMAL & REHABILITATION METRICS ---',
      `Total Reported Stray Cases: ${reportedAnimalsCount}`,
      `Cases Currently Under Treatment: ${underTreatmentCount}`,
      `Successful Adoptions Executed: ${adoptedAnimalsCount}`,
      `Rehabilitation Rate: ${reportedAnimalsCount > 0 ? ((adoptedAnimalsCount / reportedAnimalsCount) * 100).toFixed(1) : 0}%`,
      '',
      '--- TRANSACTION SUMMARIES ---',
      `Total Logged Rescue Requests: ${allRescues.length}`,
      `Total Adoption Applications: ${allAdoptions.length}`,
      '',
      '=================================================='
    ];

    res.status(200).json({
      success: true,
      reportText: lines.join('\n')
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
