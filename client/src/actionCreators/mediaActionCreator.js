import { GET_MEDIA, CALL, LISTEN_CALL, ANSWER_CALL, CALL_ACCEPTED, HANG_UP_CALL } from './type';
import {
  SOMEBODY_CALLS_ME,
  I_CALL_SOMEBODY,
  I_ANSWER_THE_CALL,
  MY_CALL_IS_ACCEPTED,
  MY_PARTENER_REQUESTS_MY_VOICE_TEXT,
  I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER,
  MY_PARTNER_SEND_VOICE_TEXT_TO_ME,
} from './socketEvents';

import Peer from 'simple-peer';
import store from '../store';

import { updateUserConversationStateActionCreator } from './authActionCreators';
import { updateUserConversationToFalseActionCreator } from './authActionCreators';
import { createVideoChatActionCreator } from './videoChatActionCreators';

export const getMediaActionCreator = () => (dispatch) => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    dispatch({
      type: GET_MEDIA,
      payload: stream,
    });
    // setMyVideoStreamObject(stream);
    // myVideoRef.current.srcObject = stream; // ここなーーー。どうだろう。// chatscreenの方でuseEffectすればいいのかね。。。ここだけ。
  });
};

// const socket = io(process.env.REACT_APP_WEBRTC);

// export const getSocketIdActionCreator = () => async (dispatch, getState) => {
//   socket.on(I_GOT_SOCKET_ID, async (socketIdFromServer) => {
//     console.log('socket??????');
//     // const id = getState().authState.currentUser._id;
//     // await mosquitareAPI.patch(`/users/${id}`, { socketId: socketIdFromServer });
//     // store.dispatch(getUsersActionCreator());
//     dispatch({
//       type: GET_SOCKET_ID,
//       payload: socketIdFromServer,
//     });
//   });
// };

// これだめ。。。
// export const getSocketIdActionCreator = async (socket, dispatch) => {
//   return new Promise((resolve, reject) => {
//     socket.on(I_GOT_SOCKET_ID, (info) => {
//       resolve(info);
//     });
//   });
// };

// dispatch({
//   type: GET_SOCKET_ID,
//   payload: socketIdFromServer,
// });

//   dispatch({
//     type: GET_SOCKET_ID,
//     payload: socketIdFromServer,
//   });
// });
// resolve();

// let peerInitiator = new Peer({
//   initiator: true,
//   stream: store.getState().mediaState.myVideoStreamObject,
//   trickle: false,
// });

// let peerReciever = new Peer({
//   initiator: false,
//   stream: store.getState().mediaState.myVideoStreamObject,
//   trickle: false,
// });

export const callActionCreator =
  (socket, mySocketId, myVideoRef, oppositeSocketId, oppositeVideoRef, connectionRef) => (dispatch, getState) => {
    // ここで、serverとのconnectionを確保してから、socketIdのupdateをするっていう方法なのかね。。。
    const { myVideoStreamObject } = getState().mediaState;
    // const { mySocketId } = getState().mediaState;
    // const mySocketId = getState().authState.currentUser.socketId; // ここはcomponentのstateを使う。
    console.log('Im calling...');
    const callerUserInfo = getState().authState.currentUser;

    const peerInitiator = new Peer({ initiator: true, stream: myVideoStreamObject, trickle: false });
    peerInitiator.on('signal', (signalData) => {
      socket.emit(I_CALL_SOMEBODY, { signalData, mySocketId, oppositeSocketId, callerUserInfo }); // ここに、callerのdataを加えよう。
      dispatch({
        type: CALL,
        payload: '',
      });
    });
    socket.on(MY_CALL_IS_ACCEPTED, (dataFromServer) => {
      console.log('My call is accepted.');
      dispatch({
        type: CALL_ACCEPTED,
        payload: dataFromServer.recieverUserInfo,
      });
      peerInitiator.signal(dataFromServer.signalData);
    });

    peerInitiator.on('stream', (stream) => {
      myVideoRef.current.srcObject = myVideoStreamObject;
      oppositeVideoRef.current.srcObject = stream;
      // ここから録画開始みたいにできないかね。二つの動画を自分と相手のstreamを録画して、二つを組み合わせて新しいmp4 fileを作る感じにできないかね。少なくとも、getDisplayだとpopup windowが出て使いづらいんだわ。
      store.dispatch(updateUserConversationStateActionCreator(callerUserInfo._id));
      connectionRef.current = peerInitiator;
      console.log('call accepted??????');
      store.dispatch(createVideoChatActionCreator(callerUserInfo._id, socket)); // ここでcreate chatのacをtriggerする。callerが作る。
    });
  };

// export const listenCallActionCreator = (socket) => (dispatch) => {
//   console.log('it works????');
//   socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
//     console.log('somebody calls me!!!');
//     console.log(dataFromServer);
//     const { signalData, whoIsCalling } = dataFromServer;
//     dispatch({
//       type: LISTEN_CALL,
//       payload: { signalData, whoIsCalling },
//     });
//   });
// }; // 結局使わないかな。。。

export const listenCallActionCreator = (socket, setFullscreen1on1Modal, setShow1on1) => (dispatch) => {
  socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
    console.log('somebody calls me!!!');
    const { signalData, whoIsCalling, callerUserInfo } = dataFromServer;
    console.log(signalData, whoIsCalling);
    setFullscreen1on1Modal(true);
    setShow1on1(true);
    // myVideo.current.srcObject = myVideoStreamObject;
    dispatch({
      type: LISTEN_CALL,
      payload: { signalData, whoIsCalling, callerUserInfo },
    });
  }); // acに移そう。
};

export const answerCallActionCreator =
  (socket, myVideoRef, oppositeVideoRef, connectionRef) => (dispatch, getState) => {
    dispatch({
      type: ANSWER_CALL,
      payload: '',
    });
    console.log('Im answering.');
    // 確かに、こういう場合はcallerが誰か持ってなきゃな。
    const { myVideoStreamObject } = getState().mediaState;
    const { whoIsCalling } = getState().mediaState;
    const { callerSignal } = getState().mediaState;

    const recieverUserInfo = getState().authState.currentUser;
    console.log(callerSignal);
    const peerReciever = new Peer({ initiator: false, stream: myVideoStreamObject, trickle: false });
    myVideoRef.current.srcObject = myVideoStreamObject;

    peerReciever.on('stream', (stream) => {
      console.log('working??');
      console.log(stream);
      oppositeVideoRef.current.srcObject = stream;
    });

    peerReciever.on('signal', (signalData) => {
      socket.emit(I_ANSWER_THE_CALL, { signalData, whoIsCalling, recieverUserInfo });
      store.dispatch(updateUserConversationStateActionCreator(recieverUserInfo._id));
    });

    peerReciever.signal(callerSignal);
    connectionRef.current = peerReciever;
    console.log('I answered');
  };

// export const callAcceptedActionCreator = (oppositeVideoRef, connectionRef) => (dispatch) => {
//   socket.on(MY_CALL_IS_ACCEPTED, (signalData) => {
//     console.log('My call is accepted.');
//     console.log(signalData);

//     dispatch({
//       type: CALL_ACCEPTED,
//       payload: '',
//     });
//     peerInitiator.signal(signalData);
//     console.log('not sure...');
//   });

//   peerInitiator.on('stream', (stream) => {
//     oppositeVideoRef.current.srcObject = stream;
//   });

//   connectionRef.current = peerInitiator;
// };

export const hangUpCallActionCreator = (connectionRef) => (dispatch) => {
  console.log('should be working!!');
  store.dispatch(updateUserConversationToFalseActionCreator());
  connectionRef.current.destroy();
  dispatch({
    type: HANG_UP_CALL,
    payload: '',
  });
  // history.push('/worldmap'); こうではなくて、modalを閉じることが必要だ。
  // その前にrecordingだ。
  window.location = '/worldmap'; // まあこれでいいのかね。
};

export const sendVoiceTextActionCreator = (socket, voiceText, microphone) => (dispatch, getState) => {
  socket.on(MY_PARTENER_REQUESTS_MY_VOICE_TEXT, () => {
    console.log('gonna send voice text');
    // setRequestedSubtitle(true);
    const to = getState().mediaState.callingWith.socketId;
    // ここに何かいるのか。もしかしたら、ここでmicrophoneのresultのcallbackとして入れるのがいいかもしれん。setRequestedはいらないかも。
    microphone.start();
    microphone.onresult = (event) => {
      // console.log(event);
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join('');
      console.log(transcript);
      // setVoiceText(transcript);
      // props.sendVoiceTextActionCreator(props.socket, voiceText, setRequestedSubtitle);
      socket.emit(I_SEND_MY_VOICE_TEXT_TO_MY_PARTNER, {
        to: to,
        voiceText: transcript,
      });
    };
  });
};

export const getVoiceTextActionCreator = (socket, setVoiceText) => () => {
  socket.on(MY_PARTNER_SEND_VOICE_TEXT_TO_ME, (dataFromServer) => {
    // ここにrenderするfunctionを作る感じかな。
    console.log('partner sent to me...');
    console.log(dataFromServer.voiceText);
    // display(voiceText)
    setVoiceText(dataFromServer.voiceText);
  });
};

export const recordStreamActionCreator = (mediaRecorder, setChunks) => (dispatch, getState) => {
  try {
    // const record = getState().mediaState.callAccepted;
    // if (record) {
    const { myVideoStreamObject } = getState().mediaState;
    mediaRecorder = new MediaRecorder(myVideoStreamObject); // これだけ外に出しておいた方がいいかもな。hangupcallの時にonstopを実装するから。
    // let chunks = [];
    mediaRecorder.start();
    mediaRecorder.ondataavailable = function (event) {
      // chunks.push(event.data);
      setChunks((oldChunks) => {
        return [...oldChunks, event.data];
      });
    };
    // } else {
    // }
  } catch (error) {
    console.log(error);
  }
};
