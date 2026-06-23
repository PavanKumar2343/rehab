const { Server } = require('socket.io');

let io = null;
const onlineUsers = new Map(); // userId -> array of socketIds

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production environments
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    // Join room based on user role or custom room
    socket.on('join', (data) => {
      if (!data || !data.userId) return;
      const { userId, role, shelterId } = data;
      
      // Store in online mapping
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, []);
      }
      onlineUsers.get(userId).push(socket.id);

      // Join individual user room
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined room user_${userId}`);

      // Join role specific rooms
      if (role === 'admin') {
        socket.join('admins');
        console.log(`Socket ${socket.id} joined room admins`);
      } else if (role === 'shelter' && shelterId) {
        socket.join(`shelter_${shelterId}`);
        socket.join('shelters');
        console.log(`Socket ${socket.id} joined rooms shelter_${shelterId} and shelters`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // Clean up mapping
      for (const [userId, sockets] of onlineUsers.entries()) {
        const index = sockets.indexOf(socket.id);
        if (index !== -1) {
          sockets.splice(index, 1);
          if (sockets.length === 0) {
            onlineUsers.delete(userId);
          }
          break;
        }
      }
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

const sendToUser = (userId, event, data) => {
  if (io) {
    io.to(`user_${userId}`).emit(event, data);
  }
};

const sendToRoom = (room, event, data) => {
  if (io) {
    io.to(room).emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  sendToUser,
  sendToRoom
};
