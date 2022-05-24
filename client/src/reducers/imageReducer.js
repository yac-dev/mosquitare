const INITAIL_STATE = {
  image: {
    data: null,
    url: null,
  },
};

const imageReducer = (state = INITAIL_STATE, action) => {
  switch (action.type) {
    case 'SET_IMAGE':
      // {data: file, url: URL.createObjectURL(file)}
      const image = {
        data: action.payload.data,
        url: action.payload.url,
      };
      return { ...state, image };
    default:
      return { ...state };
  }
};

export default imageReducer;
