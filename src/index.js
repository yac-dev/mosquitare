import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../', 'config/dev.env') });

import http from 'http';
import app from './app';
const port = process.env.PORT;
const server = http.createServer(app);
import { Server } from 'socket.io';

import {
  I_GOT_SOCKET_ID,
  I_CALL_SOMEBODY,
  SOMEBODY_CALLS_ME,
  I_ANSWER_THE_CALL,
  MY_CALL_IS_ACCEPTED,
} from './socketEvents';

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
  socket.emit(I_GOT_SOCKET_ID, socket.id);

  socket.on(I_CALL_SOMEBODY, (dataFromCaller) => {
    // console.log(dataFromCaller);
    console.log('server?????');
    // console.log(dataFromCaller.oppositeSocketId);
    // console.log(dataFromCaller);
    io.to(dataFromCaller.oppositeSocketId).emit(SOMEBODY_CALLS_ME, {
      signalData: dataFromCaller.signalData,
      whoIsCalling: dataFromCaller.mySocketId,
      callerUserInfo: dataFromCaller.callerUserInfo,
    });
  });

  socket.on(I_ANSWER_THE_CALL, (dataFromAnswerer) => {
    console.log(dataFromAnswerer);
    io.to(dataFromAnswerer.whoIsCalling).emit(MY_CALL_IS_ACCEPTED, {
      signalData: dataFromAnswerer.signalData,
      recieverUserInfo: dataFromAnswerer.recieverUserInfo,
    });
  });
});

server.listen(port, () => {
  console.log(`Server listenning on port ${port}`);
});
