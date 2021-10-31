import { SIGNUP, ADD_USER_GLOBALLY, GET_USERS } from '../actionCreators/type';

const globalUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_USER_GLOBALLY:
      // const user = state[action.payload.currentUser._id];
      return { ...state, [action.payload.currentUser._id]: action.payload };
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

export default globalUsersReducer;
