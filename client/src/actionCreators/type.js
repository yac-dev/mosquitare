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
export const CALL_ACCEPTED = 'CALL_ACCEPTED';
export const HANG_UP_CALL = 'HANG_UP_CALL';

// 次↓
// conversation 始まり
export const CREATE_CONVERSATION = 'CREATE_CONVERSATION';
export const GET_CONVERSATION_ID = 'GET_CONVERSATION_ID';

// users
export const GET_USERS = 'GET_USERS';

// meetings
export const GET_MEETINGS = 'GET_MEETINGS';
export const CREATE_MEETING = 'CREATE_MEETING';

// currentMeetingに関するやつ
export const JOIN_MEETING = 'JOIN_MEETING'; // 基本、meetingを作ること、入ること両方の意味を持つ。
