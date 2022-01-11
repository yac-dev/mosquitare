import { GET_CONVERSATION, GET_CALLEDUSER_VIDEO_STREAM, GET_RECIEVEDUSER_VIDEO_STREAM } from '../actionCreators/type';

const currentWatchingConversationReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CONVERSATION:
      return { ...state, currentWatchingConversation: action.payload };
    case GET_CALLEDUSER_VIDEO_STREAM:
      return { ...state, calledUserVideo: action.payload };
    case GET_RECIEVEDUSER_VIDEO_STREAM:
      return { ...state, recievedUserVideo: action.payload };
    default:
      return state;
  }
};

export default currentWatchingConversationReducer;
