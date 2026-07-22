try { require('dotenv').config({ path: require('path').join(__dirname, '..', 'server', '.env') }); } catch (_) {}

// Load the server's Express app FIRST — this loads mongoose, all models, routes,
// controllers, etc. with the SAME mongoose instance from server/node_modules.
const app = require('../server/src/app');

// Now require('mongoose') returns the SAME cached instance that models use
const mongoose = require('mongoose');

let cached = global._mongooseCache || (global._mongooseCache = { conn: null, promise: null });

async function getDB() {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  cached.conn = null;
  cached.promise = null;
  try { await mongoose.disconnect(); } catch (_) {}
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

// MongoDB connection middleware — runs before all /api routes
app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  try {
    await getDB();
    next();
  } catch (err) {
    console.error('MongoDB:', err.message);
    res.status(500).json({ success: false, message: 'DB: ' + err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'LSS API is running', endpoints: '/api/*' });
});

module.exports = app;
