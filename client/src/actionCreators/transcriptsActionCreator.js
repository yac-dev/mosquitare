import { mosquitareAPI } from '../apis/mosquitare';
import { GET_TRANSCRIPTS } from './type';

export const getTranscriptsByConversationIdActionCreator = () => async (dispatch, getState) => {
  try {
    const conversationId = getState().conversationState.currentConversation._id;
    console.log(conversationId);
    const result = await mosquitareAPI.get(`/transcripts/${conversationId}`);
    const { transcripts } = result.data;
    console.log(transcripts);
    dispatch({
      type: GET_TRANSCRIPTS,
      payload: transcripts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const cleanUpTranscripts = () => {
  return {
    type: 'CLEAN_UP_TRANSCRIPTS',
    payload: '',
  };
};
