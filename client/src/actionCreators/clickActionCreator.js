export const clickMapUserActionCreator = (user) => {
  return {
    type: 'CLICK_MAP_USER',
    payload: user,
  };
};

export const clickMessageUserActionCreator = (user) => {
  return {
    type: 'CLICK_MESSAGE_USER',
    payload: user,
  };
};
