import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_COMMENT } from './type';
import history from '../history';

export const createCommentActionCreator = () => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const conversationId = getState().conversationState._id;
    const result = await mosquitareAPI.post(`/comments/${conversationId}/${userId}`);
    const { comment } = result.data;
    dispatch({
      type: CREATE_COMMENT,
      payload: comment,
    });
  } catch (error) {
    console.log(error);
  }
};
