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
  SORRY_I_DONT_WANNA_CHAT_WITH_YOU,
  MY_CALL_IS_REJECTED,
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
  I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER,
  I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER,
  MY_PARTNER_SEND_ME_INTERIM_TRANSCRIPT,
  MY_PARTNER_SEND_ME_FINAL_TRANSCRIPT,
  I_SEND_CONVERSATION_ID_TO_MY_PARTNER,
  // MY_CALLER_CREATED_VIDEO_CHAT_DOCUMENT,
  MY_CALLED_USER_CREATED_CONVERSATION,
  I_SEND_INTEGRATED_USER_MEDIA_ID_TO_MY_PARTNER, // integratedUserMediaに関すること。
  MY_CALLED_USER_CREATED_INTEGRATED_USER_MEDIA,
  I_WANNA_SWITCH_CURRENT_LANGUAGE,
  MY_PARTNER_WANNA_SWITCH_CURRENT_LANGUAGE,
  // chats
  I_SEND_CHAT_MESSAGE_TO_MY_PARTNER,
  MY_PARTNER_SEND_ME_A_CHAT_MESSAGE,
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

import Transcript from './models/transcript';
import Doc from './models/doc';
import User from './models/user';

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  path: '/mysocket',
});

// const io = socketio(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

const mapMeetingIdToUsers = {};
const mapUserToMeetingId = {};

const docDefaultValue = '';

io.on('connection', (socket) => {
  socket.emit(I_GOT_SOCKET_ID, socket.id);

  socket.on(I_CALL_SOMEBODY, (dataFromCaller) => {
    // console.log(dataFromCaller);
    // console.log('server?????');
    // console.log(dataFromCaller.oppositeSocketId);
    // console.log(dataFromCaller);
    io.to(dataFromCaller.oppositeSocketId).emit(SOMEBODY_CALLS_ME, {
      signalData: dataFromCaller.signalData,
      whoIsCalling: dataFromCaller.mySocketId,
      callerUserInfo: dataFromCaller.callerUserInfo,
      exchangingLanguages: dataFromCaller.exchangingLanguages,
    });
  });

  socket.on(I_ANSWER_THE_CALL, (dataFromAnswerer) => {
    console.log(dataFromAnswerer);
    io.to(dataFromAnswerer.whoIsCalling).emit(MY_CALL_IS_ACCEPTED, {
      signalData: dataFromAnswerer.signalData,
      recieverUserInfo: dataFromAnswerer.recieverUserInfo,
    });
  });

  socket.on(SORRY_I_DONT_WANNA_CHAT_WITH_YOU, (dataFromReject) => {
    io.to(dataFromReject.to).emit(MY_CALL_IS_REJECTED, {
      message: dataFromReject.message,
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
    io.to(dataFromAnswerer.to).emit(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, {
      nativeLanguageScript: dataFromAnswerer.nativeLanguageScript,
    });
  });

  socket.on(I_SEND_MY_FINAL_TRANSCRIPT_TO_MY_PARTNER, async (dataFromSpeaker) => {
    //  ここで、databaseにobjectを作ることをする。
    const transcript = await Transcript.create({
      transcript: dataFromSpeaker.transcriptObject.transcript,
      user: dataFromSpeaker.transcriptObject.user,
      conversation: dataFromSpeaker.transcriptObject.conversation,
      language: dataFromSpeaker.transcriptObject.language,
    });

    io.to(dataFromSpeaker.to).emit(MY_PARTNER_SEND_ME_FINAL_TRANSCRIPT, {
      transcriptObject: dataFromSpeaker.transcriptObject,
    });
  });

  socket.on(I_SEND_MY_INTERIM_TRANSCRIPT_TO_MY_PARTNER, (dataFromSpeaker) => {
    io.to(dataFromSpeaker.to).emit(MY_PARTNER_SEND_ME_INTERIM_TRANSCRIPT, {
      interimTranscript: dataFromSpeaker.interimTranscript,
    });
  });

  // conversatationに関するevent
  socket.on(I_SEND_CONVERSATION_ID_TO_MY_PARTNER, (dataFromCalledUser) => {
    // console.log('chat video worrrrrrk');
    // console.log(dataFromCalledUser.to);
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

  // chat
  socket.on(I_SEND_CHAT_MESSAGE_TO_MY_PARTNER, (dataFromSender) => {
    io.to(dataFromSender.to).emit(MY_PARTNER_SEND_ME_A_CHAT_MESSAGE, {
      messageObject: dataFromSender.messageObject,
    });
  });

  // doc
  socket.on('LETS_START_OUR_DOC', async (dataFromCaller) => {
    const doc = await Doc.create({ data: docDefaultValue, conversation: dataFromCaller.conversation });
    io.to(dataFromCaller.me).emit('STARTED_YOUR_DOC', { docId: doc._id, docData: doc.data });
    io.to(dataFromCaller.to).emit('STARTED_YOUR_DOC', { docId: doc._id, docData: doc.data });
  });

  // socket.on('GET_OUR_DOC', async (dataFromClient) => {
  //   const doc = await Document.findById(dataFromClient.docId);
  //   io.to(dataFromClient.me).emit('ITS_YOUR_DOC_DATA', doc.data);
  // });

  socket.on('SEND_DOC_CHANGE', (dataFromClient) => {
    io.to(dataFromClient.me).emit('DOC_DATA_CHANGED', { deltaData: dataFromClient.delta });
    io.to(dataFromClient.to).emit('DOC_DATA_CHANGED', { deltaData: dataFromClient.delta });
  });

  socket.on('SAVE_OUR_DOC', async (dataFromClient) => {
    console.log(dataFromClient);
    const docu = await Doc.findById(dataFromClient.docId);
    docu.data = dataFromClient.docData;
    console.log(docu);
    await docu.save();
  });

  socket.on('OUR_DOC_IS_OPENED', (dataFromClient) => {
    io.to(dataFromClient.to).emit('OPEN_MY_DOC');
  });

  socket.on('close', (data) => {
    console.log('sombody closed', data);
  });

  socket.on('disconnect', async () => {
    const user = await User.findOne({ socketId: socket.id });
    console.log(user);
    user.isAvailableNow = false;
    await user.save({ validateBeforeSave: false });
    console.log('disconnected ... ', socket.id);
  });
});

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server listenning on port ${PORT}`);
});
