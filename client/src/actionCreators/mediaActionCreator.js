import { GET_MEDIA, GET_SOCKET_ID, LISTEN_CALL, ANSWER_CALL, CALL_ACCEPTED } from './type';
import {
  I_GOT_SOCKET_ID,
  SOMEBODY_CALLS_ME,
  I_CALL_SOMEBODY,
  I_ANSWER_THE_CALL,
  MY_CALL_IS_ACCEPTED,
} from './socketEvents';

export const getMediaActionCreator = (myVideoRef) => (dispatch) => {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
    dispatch({
      type: GET_MEDIA,
      payload: stream,
    });
    // setMyVideoStreamObject(stream);
    // myVideoRef.current.srcObject = stream; ここなーーー。どうだろう。
  });
};

export const getSocketIdActionCreator = (socket) => (dispatch) => {
  socket.on(I_GOT_SOCKET_ID, (socketIdFromServer) => {
    dispatch({
      type: GET_SOCKET_ID,
      payload: socketIdFromServer,
    });
  });
};

export const callActionCreator =
  (socket, Peer, oppositeSocketId, oppositeVideoRef, connectionRef) => (dispatch, getState) => {
    const { myVideoStreamObject } = getState().mediaState;
    const { mySocketId } = getState().mediaState;
    console.log('Im calling...');
    console.log(myVideoStreamObject, mySocketId);

    const peer = new Peer({ initiator: true, stream: myVideoStreamObject, trickle: false });

    peer.on('signal', (signalData) => {
      socket.emit(I_CALL_SOMEBODY, { signalData, mySocketId, oppositeSocketId });
    });

    socket.on(MY_CALL_IS_ACCEPTED, (signalData) => {
      console.log('My call is accepted.');
      console.log(signalData);

      dispatch({
        type: CALL_ACCEPTED,
        payload: '',
      });
      peer.signal(signalData);
      console.log('not sure...');
    });

    peer.on('stream', (stream) => {
      oppositeVideoRef.current.srcObject = stream;
    });

    connectionRef.current = peer;
  };

export const callAcceptedActionCreator = () => () => {};

export const listenCallActionCreator = (socket) => (dispatch) => {
  socket.on(SOMEBODY_CALLS_ME, (dataFromServer) => {
    const { signalData, whoIsCalling } = dataFromServer;
    dispatch({
      type: LISTEN_CALL,
      payload: { signalData, whoIsCalling },
    });
  });
};

export const answerCallActionCreator = (socket, Peer, oppositeVideoRef, connectionRef) => (dispatch, getState) => {
  dispatch({
    type: ANSWER_CALL,
    payload: '',
  });
  console.log('Im answering.');

  const { myVideoStreamObject } = getState().mediaState;
  const { whoIsCalling } = getState().mediaState;
  const { callerSignal } = getState().mediaState;
  const peer = new Peer({ initiator: false, stream: myVideoStreamObject, trickle: false });

  peer.on('stream', (stream) => {
    oppositeVideoRef.current.srcObject = stream;
  });

  peer.on('signal', (signalData) => {
    socket.emit(I_ANSWER_THE_CALL, { signalData, whoIsCalling });
  });

  peer.signal(callerSignal);
  connectionRef.current = peer;
  console.log('I answered');
};
