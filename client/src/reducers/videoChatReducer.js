import { CREATE_VIDEO_CHAT, GET_VIDEO_CHAT_ID } from '../actionCreators/type';

const videoChatReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_VIDEO_CHAT:
      return { ...state, videoChatId: action.payload };
    case GET_VIDEO_CHAT_ID:
      return { ...state, videoChatId: action.payload };
    default:
      return state;
  }
};

export default videoChatReducer;
