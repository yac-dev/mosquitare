import { HOLD_MY_INITIATED_PEER } from '../actionCreators/type';

const peerReducer = (state = {}, action) => {
  switch (action.type) {
    case HOLD_MY_INITIATED_PEER:
      return { ...state, peerInitiator: action.payload };
    default:
      return state;
  }
};

export default peerReducer;
