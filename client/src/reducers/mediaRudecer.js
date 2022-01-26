import {
  GET_MEDIA,
  GET_SOCKET_ID,
  CALL,
  LISTEN_CALL,
  ANSWER_CALL,
  MY_CALL_ACCEPTED,
  GET_PARTNER_MEDIA,
  CALL_ACCEPTED,
  HANG_UP_CALL,
  SWITCH_CURRENT_LANGUAGE,
  RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
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
  currentLanguage: null,
  partnerSignalData: null,
  partnerVideoStreamObject: null,
  chunks: [],
};

const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MEDIA:
      return { ...state, myVideoStreamObject: action.payload };
    case CALL:
      return {
        ...state,
        amICalling: true,
        currentLanguage: action.payload,
      };
    case GET_SOCKET_ID:
      return { ...state, mySocketId: action.payload };
    case LISTEN_CALL:
      return {
        ...state,
        amIRecieving: true,
        whoIsCalling: action.payload.whoIsCalling,
        callerSignal: action.payload.signalData,
        callingWith: action.payload.callerUserInfo,
        currentLanguage: action.payload.startLanguage,
      };
    case ANSWER_CALL:
      return {
        ...state,
        callAccepted: true,
        // currentLanguage: '' // socketでもらったlanguage objectが入る。
      };
    // case CALL_ACCEPTED:
    //   return {
    //     ...state,
    //     callAccepted: true,
    //     callingWith: action.payload.recieverUserInfo,
    //   };
    case MY_CALL_ACCEPTED:
      return {
        ...state,
        callAccepted: true,
        callingWith: action.payload.recieverUserInfo,
        partnerSignalData: action.payload.partnerSignalData,
      };
    case GET_PARTNER_MEDIA:
      return { ...state, partnerVideoStreamObject: action.payload };
    // こんな具合でいんじゃないか。。
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
        currentLanguage: null,
      };
    case SWITCH_CURRENT_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
      };
    case RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST:
      return {
        ...state,
        currentLanguage: action.payload,
      };
    case 'SET_CHUNKS':
      return {
        ...state,
        chunks: [...state.chunks, action.payload],
      };
    default:
      return state;
  }
};

export default mediaReducer;
