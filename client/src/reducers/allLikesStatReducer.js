const allLikesStatReducer = (state = {}, action) => {
  switch (action.type) {
    case 'GET_ALL_LIKES_STAT':
      const allLikesStat = {};
      action.payload.forEach((stat) => {
        allLikesStat[stat._id] = stat;
      });
      console.log(allLikesStat);
      return { ...state, ...allLikesStat };
    default:
      return { ...state };
  }
};

export default allLikesStatReducer;
