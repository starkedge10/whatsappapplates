import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import connect from './database/connection.js';
import webhookRoutes from './routes/webhookRoutes.js';
import templateRoutes from './routes/templateRoutes.js';
import campaignRoutes from './routes/campaignRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import replyMaterialRoutes from './routes/replyMaterialRoutes.js';
import keywordRoutes from './routes/keywordRoutes.js';
import chatbotsRoutes from './routes/chatbotsRoutes.js';
import { setupMessageSocket } from './controllers/messageController/sendMessage.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Fixed CORS configuration - removed trailing slash
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://whatsappchatbox-93c2adc302d2.herokuapp.com'
];

const io = new SocketIOServer(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

// CORS middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Heroku, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    dbName: mongoose.connection.db ? mongoose.connection.db.databaseName : 'Unknown'
  });
});

// Debug endpoint for MongoDB connection
app.get('/debug/db', async (req, res) => {
  try {
    const dbStatus = {
      readyState: mongoose.connection.readyState,
      readyStateText: ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState],
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections)
    };
    res.json(dbStatus);
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Simple test template endpoint
app.get('/test-templates', async (req, res) => {
  try {
    console.log('Test templates endpoint called');
    console.log('MongoDB state:', mongoose.connection.readyState);
    
    // Simple response without database query first
    res.json({ 
      message: 'Test templates endpoint working',
      dbConnected: mongoose.connection.readyState === 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Test templates error:', error);
    res.status(500).json({ error: error.message });
  }
});

// API routes with /api prefix for better organization
app.use('/api', webhookRoutes);
app.use('/api', templateRoutes);
app.use('/api', campaignRoutes);
app.use('/api', contactRoutes);
app.use('/api', replyMaterialRoutes);
app.use('/api', keywordRoutes);
app.use('/api', chatbotsRoutes);
app.use('/api', chatRoutes);

// Legacy routes (for backward compatibility)
app.use('/', webhookRoutes);
app.use('/', templateRoutes);
app.use('/', campaignRoutes);
app.use('/', contactRoutes);
app.use('/', replyMaterialRoutes);
app.use('/', keywordRoutes);
app.use('/', chatbotsRoutes);
app.use('/', chatRoutes);

// Socket.io
app.set('io', io);
setupMessageSocket(io);

// Serve static files - Fixed path handling for your project structure
const clientPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../client/dist') 
  : path.join(__dirname, '../client/dist');

console.log('Client path:', clientPath);
app.use(express.static(clientPath));

// Serve React app for all other routes
app.get('*', (req, res) => {
  const indexPath = path.resolve(__dirname, '../client', 'dist', 'index.html');
  console.log('Serving index.html from:', indexPath);
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server with better error handling
const start = async () => {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('Database URI:', process.env.ATLAS_URI ? 'Set (length: ' + process.env.ATLAS_URI.length + ')' : 'Not set');
    console.log('All environment variables:', Object.keys(process.env).filter(key => key.includes('ATLAS') || key.includes('MONGO')));
    
    if (!process.env.ATLAS_URI) {
      throw new Error('ATLAS_URI environment variable is not set');
    }
    
    await connect(process.env.ATLAS_URI);
    console.log('✅ MongoDB connected successfully');
    
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📂 Serving static files from: ${clientPath}`);
      console.log('🔗 Available routes:');
      console.log('  - GET /health');
      console.log('  - GET /templates');
      console.log('  - GET /api/templates');
      console.log('  - GET /keywords');
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    console.error('Stack trace:', err.stack);
    console.error('Environment check:');
    console.error('  - ATLAS_URI:', process.env.ATLAS_URI ? 'Set' : 'NOT SET');
    console.error('  - NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.error('  - PORT:', process.env.PORT || 'not set');
    process.exit(1);
  }
};

start();