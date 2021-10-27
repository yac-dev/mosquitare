import { GET_MEDIA, GET_SOCKET_ID, LISTEN_CALL, ANSWER_CALL, CALL_ACCEPTED } from '../actionCreators/type';

// initialを決めてから考えよう。来たsokcetidをどう保存するかを。
const INITIAL_STATE = {
  mySocketId: null,
  myVideoStreamObject: null, // 多分、stream object storeに保存できないや。
  amIRecievingCall: false,
  whoIsCalling: null,
  callerSignal: null,
  oppositeIdToCall: null,
  callAccepted: false,
};

const mediaReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MEDIA:
      return { ...state, myVideoStreamObject: action.payload };
    // なぜ、inspectorのmyVideoStreamObjectは空のobjectになっているけど、storeには一応入ってくれている。
    case GET_SOCKET_ID:
      return { ...state, mySocketId: action.payload };
    case LISTEN_CALL:
      return {
        ...state,
        amIRecievingCall: true,
        whoIsCalling: action.payload.whoIsCalling,
        callerSignal: action.payload.signalData,
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
      };
    default:
      return state;
  }
};

export default mediaReducer;
