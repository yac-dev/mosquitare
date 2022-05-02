const INITIAL_STATE = {
  // clickedMapUser: null,
  // clickedMessageUser: null,
  navMessageIcon: {
    clicked: false,
  },
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
  messageButton: {
    clicked: false,
  },
};

const clickedUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    // case 'CLICK_USER':
    //   const user = action.payload;
    //   return { ...state, user };
    case 'CLICK_MAP_USER':
      const mapUser = {
        clicked: true,
        user: action.payload,
      };

      const clearingInboxMessage = {
        clicked: false,
        message: null,
      };
      return { ...state, mapUser, inboxMessage: clearingInboxMessage };
    // case 'CLICK_MESSAGE_USER':
    //   const clickedMessageUser = action.payload;
    //   return { ...state, clickedMessageUser };
    case 'CLICK_MESSAGE':
      const inboxMessage = {
        clicked: true,
        message: action.payload,
      };

      const inboxUser = {
        clicked: true,
        user: action.payload.sender,
      };

      const clearingNavMessageIcon = {
        clicked: false,
      };
      return { ...state, inboxMessage, mapUser: inboxUser, navMessageIcon: clearingNavMessageIcon };

    case 'CLICK_VIDEO':
      const userVideo = {
        clicked: true,
        video: action.payload,
      };
      return { ...state, userVideo };
    // なぜ、こいつが同時に動くんだ？？
    case 'CLICK_NAV_MESSAGE_ICON':
      const navMessageIcon = { clicked: action.payload };
      const clearingMapUser = {
        clicked: false,
        user: null,
      };
      return { ...state, navMessageIcon, mapUser: clearingMapUser };
    case 'CLICK_MESSAGE_BUTTON':
      const messageButton = { clicked: action.payload };
      return { ...state, messageButton };
    default:
      return state;
  }
};

export default clickedUserReducer;
