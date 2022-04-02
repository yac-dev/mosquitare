import { GET_TRANSCRIPTS } from '../actionCreators/type';

const INITIAL_STATE = {};

const transcriptsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_TRANSCRIPTS:
      const conversationTranscripts = {};
      action.payload.forEach((transcript) => {
        conversationTranscripts[transcript._id] = transcript;
      });
      return { ...state, ...conversationTranscripts };
    case 'CLEAN_UP_TRANSCRIPTS':
      return { ...INITIAL_STATE };
    default:
      return { ...state };
  }
};

export default transcriptsReducer;
