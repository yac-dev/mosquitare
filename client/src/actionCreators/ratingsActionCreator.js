import { mosquitareAPI } from '../apis/mosquitare';
import { alertActionCreator } from './alertsActionCreator';

export const createRatingActionCreator = (ratingData) => async (dispatch, getState) => {
  try {
    const { conversationId } = getState().conversationState;
    const userFrom = getState().authState.currentUser._id;
    const userTo = getState().mediaState.callingWith._id;
    const result = await mosquitareAPI.post(`/ratings`, { ratingData, conversationId, userFrom, userTo });
    // localStorage.setItem('after video finish', true);
    dispatch({
      type: 'CREATE_RATING',
      payload: '',
    });

    dispatch(alertActionCreator('Thank you for your rating! Please wait until the process finish', 'success', 1500));
  } catch (error) {
    console.log(error);
    dispatch(alertActionCreator('You have already rated.', 'info'));
  }
};
