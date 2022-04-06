import { mosquitareAPI } from '../apis/mosquitare';
import { GET_DOC_ID } from './type';

export const getDocIdActionCreator = (docId) => {
  return {
    type: GET_DOC_ID,
    payload: docId,
  };
};

export const getDocByConversationIdActionCreator = () => async (dispatch, getState) => {
  try {
    console.log(getState().conversationState.conversation._id);
    const conversationId = getState().conversationState.conversation._id;
    const result = await mosquitareAPI.get(`/docs/${conversationId}`);
    const { doc } = result.data;
    dispatch({
      type: 'GET_DOC',
      payload: doc,
    });
  } catch (error) {
    console.log(error);
  }
};
