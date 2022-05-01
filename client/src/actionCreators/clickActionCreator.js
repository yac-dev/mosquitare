export const clickMessageUserActionCreator = (user) => {
  return {
    type: 'CLICK_MESSAGE_USER',
    payload: user,
  };
};
