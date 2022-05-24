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
