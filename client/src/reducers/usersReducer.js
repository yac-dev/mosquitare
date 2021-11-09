import {
  SIGNUP,
  ADD_USER_GLOBALLY,
  GET_USERS,
  UPDATE_USER_POSITION_IN_GLOBAL,
  UPDATE_USER_SOCKETID_IN_GLOBAL,
} from '../actionCreators/type';

const usersReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_USERS:
      const users = {};
      action.payload.forEach((user) => {
        users[user._id] = user;
      });
      return { ...state, ...users };
    default:
      return state;
  }
};

export default usersReducer;
