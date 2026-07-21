const express = require('express');
const cors = require('cors');

let cached = global._mongooseCache;
if (!cached) cached = global._mongooseCache = { conn: null, promise: null };

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Lazy MongoDB connection — only connects when first request hits
app.use('/api', async (req, res, next) => {
  try {
    if (!cached.conn) {
      if (!cached.promise) {
        const mongoose = require('mongoose');
        cached.promise = mongoose.connect(process.env.MONGODB_URI, {
          dbName: 'leadership-Study-S',
          serverSelectionTimeoutMS: 5000,
        }).then((m) => m);
      }
      cached.conn = await cached.promise;
    }
    next();
  } catch (err) {
    console.error('MongoDB error:', err.message);
    return res.status(500).json({ success: false, message: 'Database connection failed. Check MONGODB_URI env var.' });
  }
});

const apiRoutes = [
  { path: '/api/auth', file: '../server/src/routes/auth.routes' },
  { path: '/api/public', file: '../server/src/routes/public.routes' },
  { path: '/api/students', file: '../server/src/routes/student.routes' },
  { path: '/api/teachers', file: '../server/src/routes/teacher.routes' },
  { path: '/api/classes', file: '../server/src/routes/class.routes' },
  { path: '/api/subjects', file: '../server/src/routes/subject.routes' },
  { path: '/api/attendance', file: '../server/src/routes/attendance.routes' },
  { path: '/api/fees', file: '../server/src/routes/fee.routes' },
  { path: '/api/timetable', file: '../server/src/routes/timetable.routes' },
  { path: '/api/homework', file: '../server/src/routes/homework.routes' },
  { path: '/api/communication', file: '../server/src/routes/communication.routes' },
  { path: '/api/leaves', file: '../server/src/routes/leave.routes' },
  { path: '/api/reports', file: '../server/src/routes/report.routes' },
  { path: '/api/settings', file: '../server/src/routes/settings.routes' },
  { path: '/api/dashboard', file: '../server/src/routes/dashboard.routes' },
  { path: '/api/super-admin', file: '../server/src/routes/super-admin.routes' },
  { path: '/api/upload', file: '../server/src/routes/upload.routes' },
];

apiRoutes.forEach(({ path, file }) => {
  try {
    app.use(path, require(file));
  } catch (err) {
    console.error(`Failed to load route ${path}:`, err.message);
    app.all(path + '/*', (req, res) => {
      res.status(500).json({ success: false, message: `Route ${path} failed to load: ${err.message}` });
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'LSS API is running', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

module.exports = app;