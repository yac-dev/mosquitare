import { GET_CONVERSATION_COMMENTS, CREATE_COMMENT } from '../actionCreators/type';

const commentsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CONVERSATION_COMMENTS:
      const conversationComments = {};
      action.payload.forEach((comment) => {
        conversationComments[comment._id] = comment;
      });
      return { ...state, ...conversationComments };
    case CREATE_COMMENT:
      return { ...state, [action.payload._id]: action.payload };
    default:
      return { ...state };
  }
};

export default commentsReducer;
