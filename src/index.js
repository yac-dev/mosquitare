import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../', 'config/dev.env') });
// require('dotenv').config({ path: path.join(__dirname, '../', 'config/dev.env') });
// console.log(process.env.PORT);
// console.log(require('dotenv').config({ path: path.join(__dirname, '../', 'config/dev.env') }));

import http from 'http';
const server = http.createServer(app);
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000'],
  },
});

import app from './app';
const port = process.env.PORT;

io.on('connection', (socket) => {
  console.log(socket.id);
});

server.listen(port, () => {
  console.log('Server listenning on port 3500');
});
