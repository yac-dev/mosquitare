import { SIGNUP, LOGIN, LOAD_ME, LOGOUT } from '../actionCreators/type';

const INITIAL_STATE = {
  currentUser: null,
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
        token: action.payload.jwtToken,
      };
    case LOGOUT:
      return {
        ...state,
        currentUser: null,
        token: null,
      };
    // case UPDATE_CONVERSATION_STATE:
    //   return state // これいらないや。
    default:
      return state;
  }
};

export default authReducer;
