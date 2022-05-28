const INITIAL_STATE = {
  showInbox: false,
  editModal: false,
  signupModal: false,
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SHOW_INBOX':
      return { ...state, showInbox: true };
    case 'SET_OPEN_EDIT_MODAL':
      return { ...state, editModal: action.payload };
    case 'SET_SIGNUP_MODAL':
      return { ...state, signupModal: action.payload };
    default:
      return state;
  }
};

export default modalReducer;
