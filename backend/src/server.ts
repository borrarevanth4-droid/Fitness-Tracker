import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupLabSockets } from './sockets/lab.socket';
import { setupNotifySockets } from './sockets/notify.socket';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

setupLabSockets(io);
setupNotifySockets(io);

server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
