import {
  CREATE_CONVERSATION,
  GET_CONVERSATION_ID,
  UPDATE_CONVERSATION_RECIEVED_USER,
  SELECT_CONVERSATION,
  GET_CONVERSATION,
} from '../actionCreators/type';

const conversationReducer = (state = {}, action) => {
  switch (action.type) {
    case CREATE_CONVERSATION:
      return { ...state, conversationId: action.payload };
    case GET_CONVERSATION_ID:
      return { ...state, conversationId: action.payload };
    // case UPDATE_CONVERSATION_RECIEVED_USER:
    //   return {...state, } // いらないかなこれは
    case GET_CONVERSATION:
      return { ...state, conversation: action.payload };
    case SELECT_CONVERSATION:
      return { ...state, currentConversation: action.payload };
    case 'CNAHGE_TO_PRIVATE':
      const shallowCopy = { ...state };
      shallowCopy.conversation.isPublic = false;
      return { ...state, shallowCopy };
    default:
      return state;
  }
};

export default conversationReducer;
