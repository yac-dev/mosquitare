const INITIAL_STATE = {};
const messagesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_MY_MESSAGES':
      const myMessages = {};
      action.payload.forEach((message) => {
        myMessages[message._id] = message;
      });
      return { ...state, ...myMessages };
    default:
      return state;
  }
};

export default messagesReducer;
