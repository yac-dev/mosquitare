const INITIAL_STATE = {
  clickedMapUser: null,
  clickedMessageUser: null,
};

const clickedUserReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'CLICK_USER':
      const user = action.payload;
      return { ...state, user };
    case 'CLICK_MESSAGE_USER':
      const clickedMessageUser = action.payload;
      return { ...state, clickedMessageUser };
    default:
      return state;
  }
};

export default clickedUserReducer;
