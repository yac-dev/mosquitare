const INITIAL_STATE = {
  clickedMapUser: null,
  clickedMessageUser: null,
  mapUser: {
    clicked: false,
    user: null,
  },
  inboxMessage: {
    clicked: false,
    message: null,
  },
  userVideo: {
    clicked: false,
    video: null,
  },
};

const clickedUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CLICK_USER':
      const user = action.payload;
      return { ...state, user };
    case 'CLICK_MAP_USER':
      const mapUser = {
        clicked: true,
        user: action.payload,
      };
      return { ...state, mapUser };
    // case 'CLICK_MESSAGE_USER':
    //   const clickedMessageUser = action.payload;
    //   return { ...state, clickedMessageUser };
    case 'CLICK_INBOX_MESSAGE':
      const inboxMessage = {
        clicked: true,
        message: action.payload,
      };
      return { ...state, inboxMessage };
    case 'CLICK_USER_VIDEO':
      const userVideo = {
        clicked: true,
        userVideo: action.payload,
      };
      return { ...state, userVideo };
    default:
      return state;
  }
};

export default clickedUserReducer;
