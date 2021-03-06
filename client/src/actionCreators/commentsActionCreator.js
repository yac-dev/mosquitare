import { mosquitareAPI } from '../apis/mosquitare';
import { CREATE_COMMENT, GET_CONVERSATION_COMMENTS } from './type';
import history from '../history';

export const createCommentActionCreator = (content) => async (dispatch, getState) => {
  try {
    const userId = getState().authState.currentUser._id;
    const conversationId = getState().conversationState.conversation._id;
    const result = await mosquitareAPI.post(`/comments/${conversationId}/${userId}`, { content });
    const { comment } = result.data;
    dispatch({
      type: CREATE_COMMENT,
      payload: comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getConversationCommentsActionCreator = () => async (dispatch, getState) => {
  try {
    const conversationId = getState().conversationState.conversation._id;
    const result = await mosquitareAPI.get(`/comments/${conversationId}`);
    const { comments } = result.data;
    console.log(comments);
    dispatch({
      type: GET_CONVERSATION_COMMENTS,
      payload: comments,
    });
  } catch (error) {
    console.log(error);
  }
};

export const cleanUpComments = () => {
  return {
    type: 'CLEAN_UP_COMMENTS',
    payload: '',
  };
};

export const aggregateAllCommentsActionCreator = () => async (dispatch, getState) => {
  try {
    const result = await mosquitareAPI.get('/comments/aggregateall');
    const { allCommentsStat } = result.data;
    dispatch({
      type: 'GET_ALL_COMMENTS_STAT',
      payload: allCommentsStat,
    });
  } catch (error) {
    console.log(error);
  }
};
