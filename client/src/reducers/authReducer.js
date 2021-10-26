import { SIGNUP, LOGIN, LOAD_POSITION } from '../actionCreators/type';

const INITIALSTATE = {
  currentUser: null,
  currentUserPosition: null,
  isCurrentUserOnline: null,
  isCurrentUserBusy: false,
  isCurrentUserLoggedIn: false,
  token: localStorage.getItem('mosquitare token'),
};

const authReducer = (state = INITIALSTATE, action) => {
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
