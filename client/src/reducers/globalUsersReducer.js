import { SIGNUP, ADD_USER_GLOBALLY } from '../actionCreators/type';

const globalUsersReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_USER_GLOBALLY:
      // socketId、
      return { ...state, [action.payload.currentUser._id]: action.payload };
    default:
      return state;
  }
};

export default globalUsersReducer;
