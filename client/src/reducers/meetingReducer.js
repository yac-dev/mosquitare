// import { CREATE_MEETING } from '../actionCreators/type';
import { JOIN_MEETING } from '../actionCreators/type';

const INITIAL_STATE = {
  currentMeeting: null,
  meetingMember: null,
};

const meetingReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case JOIN_MEETING:
      return { ...state, currentMeeting: action.payload };
    default:
      return state;
  }
};

export default meetingReducer;
