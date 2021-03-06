// auth
export const SIGNUP = 'SIGNUP';
export const LOGIN = 'LOGIN';
export const LOAD_POSITION = 'LOAD_POSITION';
export const LOAD_ME = 'LOAD_ME';
export const ADD_USER_GLOBALLY = 'ADD_USER_GLOBALLY';
export const LOGOUT = 'LOGOUT';
export const UPDATE_CONVERSATION_STATE = 'UPDATE_CONVERSATION_STATE';
export const UPDATE_CONVERSATION_TO_FALSE = 'UPDATE_CONVERSATION_TO_FALSE';

// media
export const GET_SOCKET_ID = 'GET_SOCKET_ID';
export const GET_MEDIA = 'GET_MEDIA';
export const LISTEN_CALL = 'LISTEN_CALL';
export const CALL = 'CALL';
export const ANSWER_CALL = 'ANSWER_CALL';
export const MY_CALL_ACCEPTED = 'MY_CALL_ACCEPTED';
export const GET_PARTNER_MEDIA = 'GET_PARTNER_MEDIA';

export const CREATE_USER_MEDIA = 'CREATE_USER_MEDIA';
export const CREATE_USER_SCRIPT = 'CREATE_USER_SCRIPT';
export const CALL_ACCEPTED = 'CALL_ACCEPTED';
export const HANG_UP_CALL = 'HANG_UP_CALL';
export const DISCONNECT_CALL = 'DISCONNECT_CALL';
export const GOT_REJECTED = 'GOT_REJECTED';

// 次↓
// conversation 始まり
export const CREATE_CONVERSATION = 'CREATE_CONVERSATION';
export const GET_CONVERSATION_ID = 'GET_CONVERSATION_ID';
export const UPDATE_CONVERSATION_RECIEVED_USER = 'UPDATE_CONVERSATION_RECIEVED_USER';
export const GET_ALL_CONVERSATIONS = 'GET_ALL_CONVERSATIONS';
export const SELECT_CONVERSATION = 'SELECT_CONVERSATION';
export const GET_MY_CONVERSATIONS = 'GET_MY_CONVERSATIONS';

export const GET_CONVERSATION = 'GET_CONVERSATION';
export const GET_CALLEDUSER_VIDEO_STREAM = 'GET_CALLEDUSER_VIDEO_STREAM';
export const GET_RECIEVEDUSER_VIDEO_STREAM = 'GET_RECIEVEDUSER_VIDEO_STREAM';
// conversationが始まるのと同時に、integraedの方も作る。
export const CREATE_INTEGRATED_USER_MEDIA = 'CREATE_INTEGRATED_USER_MEDIA';
export const GET_INTEGRATED_USER_MEDIA_ID = 'GET_INTEGRATED_USER_MEDIA_ID';

export const SWITCH_CURRENT_LANGUAGE = 'SWITCH_CURRENT_LANGUAGE';
export const RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST = 'RECIEVE_SWITCH_CURRENT_LANGUAGE_REQUEST';

// users
export const GET_USERS = 'GET_USERS';

// meetings
export const GET_MEETINGS = 'GET_MEETINGS';
export const CREATE_MEETING = 'CREATE_MEETING';

// currentMeetingに関するやつ
export const JOIN_MEETING = 'JOIN_MEETING'; // 基本、meetingを作ること、入ること両方の意味を持つ。

// peer 持っておいて。
export const HOLD_MY_INITIATED_PEER = 'HOLD_MY_INITIATED_PEER';

// comments
export const CREATE_COMMENT = 'CREATE_COMMENT';
export const GET_CONVERSATION_COMMENTS = 'GET_CONVERSATION_COMMENTS';

// doc
export const GET_DOC_ID = 'GET_DOC_ID';

// transcripts
export const GET_TRANSCRIPTS = 'GET_TRANSCRIPTS';
