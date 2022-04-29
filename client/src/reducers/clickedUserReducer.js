const clickedUserReducer = (state = {}, action) => {
  switch (action.type) {
    case 'CLICK_USER':
      const user = action.payload;
      return { ...state, user };
    default:
      return state;
  }
};

export default clickedUserReducer;
