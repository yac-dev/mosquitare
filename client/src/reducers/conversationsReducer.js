import { GET_ALL_CONVERSATIONS, GET_MY_CONVERSATIONS } from '../actionCreators/type';

const INITAIL_STATE = {};

const conversationsReducer = (state = INITAIL_STATE, action) => {
  switch (action.type) {
    case GET_ALL_CONVERSATIONS:
      const conversations = {};
      action.payload.forEach((conversation) => {
        conversations[conversation._id] = conversation;
      });
      return { ...state, ...conversations };
    case GET_MY_CONVERSATIONS:
      const myConversations = {};
      action.payload.forEach((myConversation) => {
        myConversations[myConversation._id] = myConversation;
      });
      return { ...state, ...myConversations };
    case 'CLEAN_UP_CONVERSATIONS':
      return { ...INITAIL_STATE };
    case 'GET_USER_CONVERSATIONS':
      const userConversations = {};
      action.payload.forEach((userConversation) => {
        userConversations[userConversation._id] = userConversation;
      });
      return { ...state, ...userConversations };
    case 'CLEANUP_USER_CONVERSATIONS':
      return { ...INITAIL_STATE };
    default:
      return { ...state };
  }
};

export default conversationsReducer;
