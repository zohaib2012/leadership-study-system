try { require('dotenv').config({ path: require('path').join(__dirname, '..', 'server', '.env') }); } catch (_) {}

const path = require('path');

// MUST use the SAME mongoose instance that server models use.
// server/src/models/*.js resolve 'mongoose' to server/node_modules/mongoose.
// If api/index.js uses api/node_modules/mongoose, models are registered on a
// different instance with no connection → "buffering timed out" errors.
const mongoose = require(path.join(__dirname, '..', 'server', 'node_modules', 'mongoose'));

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

let cached = global._mongooseCache || (global._mongooseCache = { conn: null, promise: null });

async function getDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  // Stale — force full cleanup
  cached.conn = null;
  cached.promise = null;
  try { await mongoose.disconnect(); } catch (_) {}
  // Connect fresh
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI environment variable is not set');
  cached.promise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 60000,
    maxPoolSize: 5,
    minPoolSize: 0,
    bufferCommands: false,
  });
  cached.conn = await cached.promise;
  return cached.conn;
}

app.use('/api', async (req, res, next) => {
  try {
    await getDB();
    next();
  } catch (err) {
    console.error('MongoDB:', err.message);
    res.status(500).json({ success: false, message: 'DB: ' + err.message });
  }
});

// Must be registered BEFORE the routes loop so / doesn't fall through to catch
app.get('/', (req, res) => res.json({ success: true, message: 'LSS API is running', endpoints: '/api/*' }));

const routes = [
  ['/api/auth', '../server/src/routes/auth.routes'],
  ['/api/public', '../server/src/routes/public.routes'],
  ['/api/students', '../server/src/routes/student.routes'],
  ['/api/teachers', '../server/src/routes/teacher.routes'],
  ['/api/classes', '../server/src/routes/class.routes'],
  ['/api/subjects', '../server/src/routes/subject.routes'],
  ['/api/attendance', '../server/src/routes/attendance.routes'],
  ['/api/fees', '../server/src/routes/fee.routes'],
  ['/api/timetable', '../server/src/routes/timetable.routes'],
  ['/api/homework', '../server/src/routes/homework.routes'],
  ['/api/communication', '../server/src/routes/communication.routes'],
  ['/api/leaves', '../server/src/routes/leave.routes'],
  ['/api/reports', '../server/src/routes/report.routes'],
  ['/api/settings', '../server/src/routes/settings.routes'],
  ['/api/dashboard', '../server/src/routes/dashboard.routes'],
  ['/api/super-admin', '../server/src/routes/super-admin.routes'],
  ['/api/upload', '../server/src/routes/upload.routes'],
];

routes.forEach(([path, file]) => {
  try { app.use(path, require(file)); }
  catch (err) {
    console.error(`Route ${path}:`, err.message);
    app.use(path, (req, res) => res.status(500).json({ success: false, message: err.message }));
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    dbState: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState] || 'unknown',
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || 'Error' });
});

module.exports = app;