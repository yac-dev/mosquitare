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
  CREATE_USER_MEDIA,
  CREATE_USER_SCRIPT,
  DISCONNECT_CALL,
  SWITCH_CURRENT_LANGUAGE,
  RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST,
  GOT_REJECTED,
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
  exchangingLanguages: [],
  currentLanguage: null,
  partnerSignalData: null,
  partnerVideoStreamObject: null,
  chunks: [],
  apiCallResult: 0,
  callDisconnected: false,
  gotRejected: false,
  hangUp: false,
};

const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_MEDIA:
      return { ...state, myVideoStreamObject: action.payload };
    case CALL:
      return {
        ...state,
        amICalling: true,
        exchangingLanguages: action.payload,
        currentLanguage: action.payload[0],
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
        exchangingLanguages: action.payload.exchangingLanguages,
        currentLanguage: action.payload.exchangingLanguages[0],
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
        // ...state,
        // amICalling: false,
        // amIRecieving: false,
        // callingWith: null,
        // callerSignal: null,
        // oppositeIdToCall: null,
        // callAccepted: false,
        // callFinished: true,
        // currentLanguage: null,
        hangUp: true,
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
    case CREATE_USER_MEDIA:
    case CREATE_USER_SCRIPT:
    case 'SEND_LANGUAGE_STATUS':
      return { ...state, apiCallResult: state.apiCallResult + 1 };
    case DISCONNECT_CALL:
      return { ...state, callDisconnected: true };
    case GOT_REJECTED:
      return { ...state, gotRejected: true, amICalling: false };
    default:
      return state;
  }
};

export default mediaReducer;
