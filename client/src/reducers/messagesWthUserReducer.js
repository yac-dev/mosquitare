const INITIAL_STATE = {
  messagesWithUser: {},
};
// very firstなrender時点で{}だけの場合、何もないことになる。ただ、最初にinitial stateのmessagesWithUser:{}を用意しておけば、nullなもんをconvertできない、なんてことはあくなる。

const messagesWithUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'GET_MESSAGES_WITH_USER':
      const messagesWithUser = {};
      action.payload.forEach((message) => {
        messagesWithUser[message._id] = message;
      });
      return { ...state, messagesWithUser };
    case 'CLEANUP_MESSAGES_WITH_USER':
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export default messagesWithUserReducer;
