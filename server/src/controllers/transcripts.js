import Transcript from '../models/transcript';

export const createTranscript = async (request, response) => {
  // ここでresponseをsendする必要ない。clientからrouterを通ってくる必要もなし。socketに行くからね。
  const transcript = await Transcript.create({});
};

export const getTranscriptsByConversationId = async (request, response) => {
  try {
    const { conversationId } = request.params;
    const transcripts = await Transcript.find({ _id: conversationId }).populate({
      path: 'user',
      model: 'User',
      select: 'name',
    }); // array
    response.status(200).json({
      transcripts,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateTranscriptByConversationId = async (request, response) => {
  try {
    //
  } catch (error) {
    console.log(error);
  }
};
