import { GET_MEDIA, CALL, LISTEN_CALL, ANSWER_CALL, CALL_ACCEPTED, HANG_UP_CALL } from './type';
import { SOMEBODY_CALLS_ME, I_CALL_SOMEBODY, I_ANSWER_THE_CALL, MY_CALL_IS_ACCEPTED } from './socketEvents';

import Peer from 'simple-peer';
import store from '../store';

import { updateUserConversationStateActionCreator } from './authActionCreators';
import { updateUserConversationToFalseActionCreator } from './authActionCreators';

export const getMediaActionCreator = (myVideoRef) => (dispatch) => {
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
      store.dispatch(updateUserConversationStateActionCreator(callerUserInfo._id));
      connectionRef.current = peerInitiator;
      console.log('call accepted??????');
    });
  };

export const listenCallActionCreator = (socket) => (dispatch) => {
  console.log('it works????');
  socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
    console.log('somebody calls me!!!');
    console.log(dataFromServer);
    const { signalData, whoIsCalling } = dataFromServer;
    dispatch({
      type: LISTEN_CALL,
      payload: { signalData, whoIsCalling },
    });
  });
}; // 結局使わないかな。。。

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
};
