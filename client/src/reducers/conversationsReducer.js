import { GET_ALL_CONVERSATIONS, GET_MY_CONVERSATIONS } from '../actionCreators/type';

const conversationsReducer = (state = {}, action) => {
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
    default:
      return { ...state };
  }
};

export default conversationsReducer;
