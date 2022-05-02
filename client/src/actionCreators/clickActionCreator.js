export const clickMapUserActionCreator = (user) => {
  return {
    type: 'CLICK_MAP_USER',
    payload: user,
  };
};

export const clickMessageActionCreator = (message) => {
  return {
    type: 'CLICK_MESSAGE',
    payload: message,
  };
};

export const clickVideoActionCreator = (userVideo) => {
  return {
    type: 'CLICK_VIDEO',
    payload: userVideo,
  };
};

export const clickNavMessageIconActionCreator = (boolean) => {
  return {
    type: 'CLICK_NAV_MESSAGE_ICON',
    payload: boolean,
  };
};

export const clickMessageButtonActionCreator = (boolean) => {
  return {
    type: 'CLICK_MESSAGE_BUTTON',
    payload: boolean,
  };
};
