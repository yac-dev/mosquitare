import { mosquitareAPI } from '../apis/mosquitare';
import { GET_TRANSCRIPTS } from './type';

export const getTranscriptsByConversationIdActionCreator = () => async (dispatch, getState) => {
  try {
    const { selectedConversationId } = getState();
    const result = await mosquitareAPI.get(`/transcripts/${selectedConversationId}`);
    const { transcripts } = result.data;
    dispatch({
      type: GET_TRANSCRIPTS,
      payload: transcripts,
    });
  } catch (error) {
    console.log(error);
  }
};
