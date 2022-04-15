const allCommentsStatReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ALL_COMMENTS_STAT':
      const allCommentsStat = {};
      action.payload.forEach((stat) => {
        allCommentsStat[stat._id] = stat;
      });
      return { ...state, ...allCommentsStat };
    default:
      return { ...state };
  }
};

export default allCommentsStatReducer;
