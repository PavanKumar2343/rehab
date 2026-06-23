const { collections, getDocById, queryDocs, toDocs, updateDoc } = require('../config/collections');

exports.getNotifications = async (req, res) => {
  try {
    const allNotifications = await toDocs(await collections.notifications.get());
    const userNotifications = allNotifications
      .filter(n => n.recipientId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 50);

    res.status(200).json({ success: true, count: userNotifications.length, data: userNotifications.map(n => ({ ...n, _id: n.id })) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const notifSnap = await collections.notifications.doc(req.params.id).get();
    if (!notifSnap.exists) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    const notification = { id: notifSnap.id, ...notifSnap.data() };

    if (notification.recipientId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await collections.notifications.doc(notification.id).update({ isRead: true });

    res.status(200).json({ success: true, data: { ...notification, isRead: true } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
