const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const { initSocket } = require('./config/socket');

dotenv.config();

const app = express();
const server = http.createServer(app);

initSocket(server);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/shelters', require('./routes/shelterRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));
app.use('/api/rescues', require('./routes/rescueRoutes'));
app.use('/api/adoptions', require('./routes/adoptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

app.get('/', (req, res) => {
  res.json({ message: 'Animal Rehabilitation & Adoption Platform API is running.' });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'API Route not found' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File is too large! Maximum limit is 5MB.' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
