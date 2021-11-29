import { CREATE_CONVERSATION, GET_CONVERSATION_ID } from '../actionCreators/type';

const conversationReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CONVERSATION:
      return { ...state, conversationId: action.payload };
    case GET_CONVERSATION_ID:
      return { ...state, conversationId: action.payload };
    default:
      return state;
  }
};

export default conversationReducer;
