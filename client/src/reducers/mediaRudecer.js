import {
  GET_MEDIA,
  GET_SOCKET_ID,
  CALL,
  LISTEN_CALL,
  ANSWER_CALL,
  CALL_ACCEPTED,
  HANG_UP_CALL,
} from '../actionCreators/type';

const INITIAL_STATE = {
  mySocketId: null,
  myVideoStreamObject: null,
  amICalling: false,
  amIRecieving: false,
  callingWith: null,
  whoIsCalling: null, // ここ名前紛らわしいな。
  callerSignal: null,
  oppositeIdToCall: null,
  callAccepted: false,
  callFinished: false,
};

const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MEDIA:
      return { ...state, myVideoStreamObject: action.payload };
    case CALL:
      return { ...state, amICalling: true };
    case GET_SOCKET_ID:
      return { ...state, mySocketId: action.payload };
    case LISTEN_CALL:
      return {
        ...state,
        amIRecieving: true,
        whoIsCalling: action.payload.whoIsCalling,
        callerSignal: action.payload.signalData,
        callingWith: action.payload.callerUserInfo,
      };
    case ANSWER_CALL:
      return {
        ...state,
        callAccepted: true,
      };
    case CALL_ACCEPTED:
      return {
        ...state,
        callAccepted: true,
        callingWith: action.payload,
      };
    case HANG_UP_CALL:
      return {
        ...state,
        amICalling: false,
        amIRecieving: false,
        callingWith: null,
        // whoIsCalling: null,
        callerSignal: null,
        oppositeIdToCall: null,
        callAccepted: false,
        callFinished: true,
      };
    default:
      return state;
  }
};

export default mediaReducer;
