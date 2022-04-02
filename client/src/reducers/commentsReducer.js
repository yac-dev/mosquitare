import { GET_CONVERSATION_COMMENTS, CREATE_COMMENT } from '../actionCreators/type';

const INITIAL_STATE = {};

const commentsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_CONVERSATION_COMMENTS:
      const conversationComments = {};
      action.payload.forEach((comment) => {
        conversationComments[comment._id] = comment;
      });
      return { ...state, ...conversationComments };
    case CREATE_COMMENT:
      return { ...state, [action.payload._id]: action.payload };
    case 'CLEAN_UP_COMMENTS':
      return { ...INITIAL_STATE };
    default:
      return { ...state };
  }
};

export default commentsReducer;
