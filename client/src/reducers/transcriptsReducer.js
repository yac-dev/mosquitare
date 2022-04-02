import { GET_TRANSCRIPTS } from '../actionCreators/type';

const transcriptsReducer = (state = {}, action) => {
  switch (action.type) {
    case GET_TRANSCRIPTS:
      const conversationTranscripts = {};
      action.payload.forEach((transcript) => {
        conversationTranscripts[transcript._id] = transcript;
      });
      return { ...state, ...conversationTranscripts };
    default:
      return { ...state };
  }
};

export default transcriptsReducer;
