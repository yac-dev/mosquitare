import { GET_MEETINGS, CREATE_MEETING } from '../actionCreators/type';

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
    case CREATE_MEETING:
      return { ...state, [action.payload._id]: action.payload }; // かなー。postした後のデータもしっかりとってきているからね。
    default:
      return state;
  }
};

export default meetingsReducer;
