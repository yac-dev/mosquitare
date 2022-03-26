import { GET_ALL_CONVERSATIONS } from '../actionCreators/type';

const conversationsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_ALL_CONVERSATIONS:
      const conversations = {};
      action.payload.forEach((conversation) => {
        conversations[conversation._id] = conversation;
      });
      return { ...state, ...conversations };
    default:
      return { ...state };
  }
};

export default conversationsReducer;
