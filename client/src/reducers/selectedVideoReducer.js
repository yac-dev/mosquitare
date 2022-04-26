const INITIAL_STATE = {
  video: '',
};

const selectedVideoReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SELECT_VIDEO':
      const video = action.payload;
      return { ...state, video };
    case 'CLOSE_VIDEO':
      return { ...INITIAL_STATE };
    default:
      return { ...state };
  }
};

export default selectedVideoReducer;
