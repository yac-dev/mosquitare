import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();
// dotenv.config({ path: path.join(__dirname, '../', 'config/dev.env') });

import http from 'http';
import app from './app';
// const port = process.env.PORT;

import { PORT } from '../config';
const server = http.createServer(app);
import { Server } from 'socket.io';

import {
  I_GOT_SOCKET_ID,
  I_CALL_SOMEBODY,
  SOMEBODY_CALLS_ME,
  I_ANSWER_THE_CALL,
  MY_CALL_IS_ACCEPTED,
  JOIN_MEETING,
} from './socketEvents';

import { TO_ALL_OTHER_USERS } from '../client/src/actionCreators/socketEvents';

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

const mapMeetingIdToUsers = {};
const mapUserToMeetingId = {};

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
  // 以下、meetingに関するsocket events

  socket.on(JOIN_MEETING, (joinData) => {
    // (joinData)に、joinに関するroomとcallbackが入っている。
    const { meetingId, userInfo } = joinData;
    if (mapMeetingIdToUsers[meetingId]) {
      mapMeetingIdToUsers[meetingId].push(userInfo);
    } else {
      mapMeetingIdToUsers[meetingId] = [userInfo];
    }

    mapUserToMeetingId[userInfo._id] = meetingId;
    const usersInThisMeetingExceptMe = mapMeetingIdToUsers[meetingId].filter((user) => {
      user._id !== userInfo._id;
    });
    socket.emit(TO_ALL_OTHER_USERS, usersInThisMeetingExceptMe); // かなー。。。
  });
});

server.listen(PORT, () => {
  console.log(`Server listenning on port ${PORT}`);
});
