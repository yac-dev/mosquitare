import { mosquitareAPI } from '../apis/mosquitare';

export const createRatingActionCreator = (ratingData) => async (dispatch, getState) => {
  try {
    const { conversationId } = getState().conversationState;
    const userFrom = getState().authState.currentUser._id;
    const userTo = getState().mediaState.callingWith._id;
    const result = await mosquitareAPI.post(`/ratings`, { ratingData, conversationId, userFrom, userTo });
    dispatch({
      type: 'CREATE_RATING',
      payload: '',
    });
  } catch (error) {
    console.log(error);
  }
};
