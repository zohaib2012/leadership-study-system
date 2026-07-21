const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'leadership-Study-S',
      serverSelectionTimeoutMS: 5000,
    }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const app = express();

app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

app.use('/api/auth', require('../server/src/routes/auth.routes'));
app.use('/api/public', require('../server/src/routes/public.routes'));
app.use('/api/students', require('../server/src/routes/student.routes'));
app.use('/api/teachers', require('../server/src/routes/teacher.routes'));
app.use('/api/classes', require('../server/src/routes/class.routes'));
app.use('/api/subjects', require('../server/src/routes/subject.routes'));
app.use('/api/attendance', require('../server/src/routes/attendance.routes'));
app.use('/api/fees', require('../server/src/routes/fee.routes'));
app.use('/api/timetable', require('../server/src/routes/timetable.routes'));
app.use('/api/homework', require('../server/src/routes/homework.routes'));
app.use('/api/communication', require('../server/src/routes/communication.routes'));
app.use('/api/leaves', require('../server/src/routes/leave.routes'));
app.use('/api/reports', require('../server/src/routes/report.routes'));
app.use('/api/settings', require('../server/src/routes/settings.routes'));
app.use('/api/dashboard', require('../server/src/routes/dashboard.routes'));
app.use('/api/super-admin', require('../server/src/routes/super-admin.routes'));
app.use('/api/upload', require('../server/src/routes/upload.routes'));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LSS API is running', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.name === 'MulterError') return res.status(400).json({ success: false, message: err.message });
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;