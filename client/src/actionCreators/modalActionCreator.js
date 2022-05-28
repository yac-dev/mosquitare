export const showInboxModalActionCreator = () => {
  return {
    type: 'SHOW_INBOX',
    payload: '',
  };
};

export const setOpenEditModalActionCreator = (bool) => {
  return {
    type: 'SET_OPEN_EDIT_MODAL',
    payload: bool,
  };
};

export const setSignupModalActionCreator = (bool) => {
  return {
    type: 'SET_SIGNUP_MODAL',
    payload: bool,
  };
};
