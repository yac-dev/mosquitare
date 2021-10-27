import { SIGNUP, LOGIN, LOAD_POSITION, GET_SOCKET_ID } from '../actionCreators/type';

const INITIAL_STATE = {
  currentUser: null,
  currentUserPosition: null,
  isCurrentUserBusy: false,
  isCurrentUserLoggedIn: false,
  currentUserSocketId: '',
  isCurrentUserOnline: null,
  token: localStorage.getItem('mosquitare token'),
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGNUP:
    case LOGIN:
      return {
        ...state,
        currentUser: action.payload.user,
        isCurrentUserOnline: true, // browserを開いているか調べればいいのかね。
        isCurrentUserLoggedIn: true,
        token: action.payload.jwtToken,
      };
    case GET_SOCKET_ID:
      return {
        ...state,
        isCurrentUserOnline: true,
        currentUserSocketId: action.payload,
      };

    case LOAD_POSITION:
      return {
        ...state,
        currentUserPosition: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
