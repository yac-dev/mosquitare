import Doc from '../models/doc';

export const getDocByConversationId = async (request, response) => {
  try {
    const { conversationId } = request.params;
    const doc = await Doc.findOne({ conversation: conversationId });
    console.log(doc, 'doc is found');
    response.status(200).json({
      doc,
    });
  } catch (error) {
    console.log(error);
  }
};
