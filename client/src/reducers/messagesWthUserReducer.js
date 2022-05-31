const INITIAL_STATE = {
  messagesWithUser: {},
};
// very firstなrender時点で{}だけの場合、何もないことになる。ただ、最初にinitial stateのmessagesWithUser:{}を用意しておけば、nullなもんをconvertできない、なんてことはあくなる。

const messagesWithUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_MESSAGES_WITH_USER':
      const messagesWithUserList = {};
      action.payload.forEach((message) => {
        messagesWithUserList[message._id] = message;
      });
      return { ...state, messagesWithUser: messagesWithUserList };
    case 'CLEANUP_MESSAGES_WITH_USER':
      return { ...INITIAL_STATE };
    case 'CREATE_MESSAGE':
      const newList = { ...state };
      const { messagesWithUser } = newList;
      messagesWithUser[action.payload._id] = action.payload;
      return { ...state, messagesWithUser };
    default:
      return state;
  }
};

export default messagesWithUserReducer;
