import { SIGNUP } from '../actionCreators/type';

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case SIGNUP:
      return state;
    default:
      return state;
  }
};

export default authReducer;
