const likesReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_CONVERSATION_LIKES':
      const likes = {};
      action.payload.forEach((like) => {
        likes[like.user] = like;
      });
      return { ...state, ...likes };
    case 'CREATE_LIKE':
      return { ...state, [action.payload.user]: action.payload };
    default:
      return { ...state };
  }
};

export default likesReducer;
