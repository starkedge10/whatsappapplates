import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

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
const io = new SocketIOServer(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      'https://whatsappchatbox-93c2adc302d2.herokuapp.com/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true
  }
});

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://whatsappchatbox-93c2adc302d2.herokuapp.com/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true
}));

app.use(express.json());

// Your routes
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

// 🚀 Always serve React build (for Heroku + local production builds)
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
});

// Start server
const start = async () => {
  try {
    await connect(process.env.ATLAS_URI);
    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
  }
};

start();
