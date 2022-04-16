import { mosquitareAPI } from '../apis/mosquitare';
import { alertActionCreator } from './alertsActionCreator';

export const setToPrivateActionCreator = (conversationId) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const result = await mosquitareAPI.patch(`/conversationprivacysettings/private/${conversationId}`, { userId });
    dispatch({
      type: 'CNAHGE_TO_PRIVATE',
      payload: '',
    });

    dispatch(alertActionCreator('Set this conversation to private.', 'success'));
  } catch (error) {
    console.log(error);
  }
};
