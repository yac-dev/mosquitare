import {
  SIGNUP,
  ADD_USER_GLOBALLY,
  GET_USERS,
  UPDATE_USER_POSITION_IN_GLOBAL,
  UPDATE_USER_SOCKETID_IN_GLOBAL,
} from '../actionCreators/type';

const globalUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case UPDATE_USER_POSITION_IN_GLOBAL:
      console.log(action.payload);
      let user = state[action.payload.authState.currentUser._id];
      console.log(user);
      // user.currentUserPosition = action.payload.userPosition;
      // console.log(user);
      user = action.payload.authState;
      user.currentUserPosition = action.payload.userPosition;
      return { ...state, [action.payload.authState.currentUser._id]: user };

    // case UPDATE_USER_SOCKETID_IN_GLOBAL:
    //   let usr = state[action.payload.authState.currentUser._id];
    //   usr = action.payload.authState;
    //   usr.currentUserSocketId = action.payload.socketIdFromServer;
    //   return { ...state, [action.payload.authState.currentUser._id]: usr };

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
