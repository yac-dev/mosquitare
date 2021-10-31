import {
  SIGNUP,
  LOGIN,
  LOAD_ME,
  LOAD_POSITION,
  GET_SOCKET_ID,
  CALL_ACCEPTED,
  ADD_USER_GLOBALLY,
} from '../actionCreators/type';

const INITIAL_STATE = {
  currentUser: null,
  currentUserPosition: null,
  isCurrentUserInConversation: false,
  isCurrentUserLoggedIn: false,
  currentUserSocketId: '',
  isCurrentUserOnline: null,
  token: localStorage.getItem('mosquitare token'),
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGNUP:
    case LOGIN:
    case LOAD_ME:
      return {
        ...state,
        currentUser: action.payload.user,
        isCurrentUserOnline: true,
        isCurrentUserLoggedIn: true,
        token: action.payload.jwtToken,
      };
    case LOAD_POSITION:
      return {
        ...state,
        currentUserPosition: action.payload,
      };
    case GET_SOCKET_ID:
      return {
        ...state,
        isCurrentUserOnline: true,
        currentUserSocketId: action.payload,
      };
    case CALL_ACCEPTED:
      return {
        ...state,
        isCurrentUserInConversation: true,
      };

    default:
      return state;
  }
};

export default authReducer;
