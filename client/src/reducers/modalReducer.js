const INITIAL_STATE = {
  showInbox: false,
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SHOW_INBOX':
      return { ...state, showInbox: true };
    default:
      return state;
  }
};

export default modalReducer;
