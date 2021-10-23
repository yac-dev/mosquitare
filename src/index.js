import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../', 'config/dev.env') });

import http from 'http';
import app from './app';
const port = process.env.PORT;
const server = http.createServer(app);
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// const io = socketio(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

io.on('connection', (socket) => {
  socket.emit('ME', socket.id);

  socket.on('CALL', (data) => {
    io.to(data.oppositeId).emit('CALL', { signalData: data.signalData, caller: data.me });
  });

  socket.on('ANSWER', (data) => {
    io.to(data.caller).emit('ACCEPTED', data.signalData);
  });
});

server.listen(port, () => {
  console.log(`Server listenning on port ${port}`);
});
