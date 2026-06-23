import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token, authFetch } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);

  // Fetch notifications log
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await authFetch('/api/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.data.filter(n => !n.isRead).length);
      }
    } catch (err) {
      console.error('Error fetching notifications list:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, token]);

  // Establish socket connection on login
  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    const socketInstance = io('/', {
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Socket.io connected:', socketInstance.id);
      
      // Join corresponding role/user rooms
      socketInstance.emit('join', {
        userId: user.id,
        role: user.role,
        shelterId: user.shelter?.id
      });
    });

    // Listen for new rescue reports (for shelters)
    socketInstance.on('new_rescue_request', (data) => {
      console.log('Realtime Event: new_rescue_request received:', data);
      
      // Play audio notification chime (using browser synthesized audio fallback if no file)
      playChime();

      setAlertMessage({
        title: data.notification?.title || 'New Rescue Request Nearby!',
        message: data.notification?.message || 'Check your incoming requests feed.',
        type: 'rescue'
      });

      fetchNotifications();
    });

    // Listen for rescue updates (for reporters)
    socketInstance.on('rescue_update', (data) => {
      console.log('Realtime Event: rescue_update received:', data);
      playChime();

      setAlertMessage({
        title: data.notification?.title || 'Rescue Status Update!',
        message: data.notification?.message || 'An animal you reported has updated status.',
        type: 'update'
      });

      fetchNotifications();
    });

    // Listen for adoption applications (for shelters)
    socketInstance.on('new_adoption_application', (data) => {
      console.log('Realtime Event: new_adoption_application received:', data);
      playChime();

      setAlertMessage({
        title: data.notification?.title || 'New Adoption Request!',
        message: data.notification?.message || 'A user has applied to adopt one of your animals.',
        type: 'adoption'
      });

      fetchNotifications();
    });

    // Listen for adoption approvals (for reporters)
    socketInstance.on('adoption_update', (data) => {
      console.log('Realtime Event: adoption_update received:', data);
      playChime();

      setAlertMessage({
        title: data.notification?.title || 'Adoption Request Updated!',
        message: data.notification?.message || 'Your adoption application status has changed.',
        type: 'adoption'
      });

      fetchNotifications();
    });

    // Listen for shelter approvals (for shelters)
    socketInstance.on('shelter_verification_update', (data) => {
      console.log('Realtime Event: shelter_verification_update received:', data);
      playChime();

      setAlertMessage({
        title: data.notification?.title || 'Verification Update!',
        message: data.notification?.message || 'Your shelter registration status has been modified.',
        type: 'verification'
      });

      fetchNotifications();
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Audio tone notification helper using web audio API to avoid file path errors
  const playChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5 note

      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);

      oscillator.start(audioCtx.currentTime);
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.log('Audio contextual chime skipped due to user interaction rules', e);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const res = await authFetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT'
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(prev => 
          prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const clearAlert = () => setAlertMessage(null);

  return (
    <SocketContext.Provider value={{ socket, notifications, unreadCount, alertMessage, clearAlert, markAsRead, refetchNotifications: fetchNotifications }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export default SocketContext;
