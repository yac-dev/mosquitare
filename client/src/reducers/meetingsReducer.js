import { GET_MEETINGS } from '../actionCreators/type';

const meetingsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MEETINGS:
      return state;
    default:
      return state;
  }
};

export default meetingsReducer;
