import { GET_CONVERSATION } from '../actionCreators/type';

const currentWatchingConversationReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_CONVERSATION:
      return { ...state, currentWatchingConversation: action.payload };
    default:
      return state;
  }
};

export default currentWatchingConversationReducer;
