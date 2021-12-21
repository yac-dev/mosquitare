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
  I_GOT_OTHER_USERS_INFO,
  PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS,
  NEW_USER_JOINED,
  I_ACCEPT_A_PARTICIPANT_AND_SEND_A_SIGNAL,
  I_GOT_A_RETURN_SIGNAL_FROM_PEER,
  I_REQUEST_PARTNERS_VOICE_TEXT,
  MY_PARTENER_REQUESTS_MY_VOICE_TEXT,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
  I_SEND_CONVERSATION_ID_TO_MY_PARTNER,
  // MY_CALLER_CREATED_VIDEO_CHAT_DOCUMENT,
  MY_CALLED_USER_CREATED_CONVERSATION,
  I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, // integratedUserMediaに関すること。
  MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA,
  I_WANNA_SWITCH_CURRENT_LANGUAGE,
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
} from './socketEvents';

// 上に全部移した。
// import {
//   I_GOT_OTHER_USERS_INFO,
//   PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS,
//   NEW_USER_JOINED,
//   I_ACCEPT_A_PARTICIPANT_AND_SEND_A_SIGNAL,
//   I_GOT_A_RETURN_SIGNAL_FROM_PEER,
//   I_REQUEST_PARTNERS_VOICE_TEXT,
//   MY_PARTENER_REQUESTS_MY_VOICE_TEXT,
//   I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
//   MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
//   I_SEND_CONVERSATION_ID_TO_MY_PARTNER,
//   // MY_CALLER_CREATED_VIDEO_CHAT_DOCUMENT,
//   MY_CALLED_USER_CREATED_CONVERSATION,
//   I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, // integratedUserMediaに関すること。
//   MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA,
//   I_WANNA_SWITCH_CURRENT_LANGUAGE,
//   MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
// } from '../client/src/actionCreators/socketEvents';

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
      startLanguage: dataFromCaller.startLanguage,
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
    const { meeting, userInfo } = joinData;
    const meetingId = meeting._id;
    if (mapMeetingIdToUsers[meetingId]) {
      mapMeetingIdToUsers[meetingId].push(userInfo);
    } else {
      mapMeetingIdToUsers[meetingId] = [userInfo];
    }

    // 多分だけど、こっちserver側でのhash tableの管理の仕方はほぼどうでもいい。だから、property名がなんであろうと、どうでもいい。
    mapUserToMeetingId[userInfo._id] = meetingId;
    const usersInThisMeetingExceptParticipant = mapMeetingIdToUsers[meetingId].filter(
      (user) => user._id !== userInfo._id
    ); // 結局やっていることとしては、joinしたuserがserverからroom内の他の人たちの情報をただもらっているだけなんですよ。全員に対してpeer objectを作るためにね。
    // console.log(mapMeetingIdToUsers);
    // console.log(usersInThisMeetingExceptParticipant);
    // console.log(mapUserToMeetingId);
    socket.emit(I_GOT_OTHER_USERS_INFO, usersInThisMeetingExceptParticipant);
  });

  socket.on(PARTICIPANT_IS_SENDING_SIGNAL_TO_OTHER_USERS, (dataFromParticipant) => {
    // console.log(dataFromParticipant.oppositeUserInfo);
    // console.log(dataFromParticipant.callerUserInfo);
    io.to(dataFromParticipant.oppositeUserInfo.socketId).emit(NEW_USER_JOINED, {
      signalData: dataFromParticipant.signalData,
      callerUserInfo: dataFromParticipant.callerUserInfo,
    });
  });

  socket.on(I_ACCEPT_A_PARTICIPANT_AND_SEND_A_SIGNAL, (dataFromPeers) => {
    io.to(dataFromPeers.callerUserInfo.socketId).emit(I_GOT_A_RETURN_SIGNAL_FROM_PEER, {
      // ここのio toのところがおかしい。callerUserInfoがnullだってよ。何だろね。これ。
      signalData: dataFromPeers.signalData,
      peerInfo: dataFromPeers.peerInfo,
    });
  });

  // 字幕に関するsocket event
  socket.on(I_REQUEST_PARTNERS_VOICE_TEXT, (dataFromRequester) => {
    io.to(dataFromRequester.to).emit(MY_PARTENER_REQUESTS_MY_VOICE_TEXT);
  });

  socket.on(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, (dataFromAnswerer) => {
    io.to(dataFromAnswerer.to).emit(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, { voiceText: dataFromAnswerer.voiceText });
  });

  // conversatationに関するevent
  socket.on(I_SEND_CONVERSATION_ID_TO_MY_PARTNER, (dataFromCalledUser) => {
    console.log('chat video worrrrrrk');
    console.log(dataFromCalledUser.to);
    io.to(dataFromCalledUser.to).emit(MY_CALLED_USER_CREATED_CONVERSATION, {
      conversationId: dataFromCalledUser.conversationId,
    });
  });

  socket.on(I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, (dataFromCalledUser) => {
    io.to(dataFromCalledUser.to).emit(MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA, {
      integratedUserMediaId: dataFromCalledUser.integratedUserMediaId,
    });
  });

  socket.on(I_WANNA_SWITCH_CURRENT_LANGUAGE, (dataFromSwitchingUser) => {
    io.to(dataFromSwitchingUser.to).emit(MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE, {
      switchingLanguage: dataFromSwitchingUser.switchingLanguage,
    });
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server listenning on port ${PORT}`);
});
