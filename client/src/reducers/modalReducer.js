const INITIAL_STATE = {
  showInbox: false,
  editModal: false,
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SHOW_INBOX':
      return { ...state, showInbox: true };
    case 'SET_OPEN_EDIT_MODAL':
      return { ...state, editModal: action.payload };
    default:
      return state;
  }
};

export default modalReducer;
