import { GET_MEETINGS } from '../actionCreators/type';

const meetingsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_MEETINGS:
      const meetings = {};
      action.payload.forEach((meeting) => {
        meetings[meeting._id] = meeting;
      });
      return {
        ...state,
        ...meetings,
      };
    default:
      return state;
  }
};

export default meetingsReducer;
