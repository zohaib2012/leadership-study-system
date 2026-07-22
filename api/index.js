try { require('dotenv').config({ path: require('path').join(__dirname, '..', 'server', '.env') }); } catch (_) {}

const path = require('path');

// MUST use server's mongoose instance (server/models/*.js resolve mongoose to server/node_modules/mongoose).
// If api/index.js uses a different mongoose instance, models are registered on one instance but
// connection is on another → "buffering timed out" errors.
const mongoose = require(path.resolve(__dirname, '..', 'server', 'node_modules', 'mongoose'));

const express = require('express');
const app = express();

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

// MongoDB middleware — MUST be registered BEFORE routes
app.use(async (req, res, next) => {
  if (!req.path.startsWith('/api')) return next();
  try {
    await getDB();
    next();
  } catch (err) {
    console.error('MongoDB:', err.message);
    return res.status(500).json({ success: false, message: 'DB: ' + err.message });
  }
});

// Root route — MUST be before server app to avoid catch-all
app.get('/', (req, res) => {
  res.json({ success: true, message: 'LSS API is running', status: 'ok' });
});

// Mount the server's Express app (all routes, models, controllers)
app.use(require('../server/src/app'));

module.exports = app;
