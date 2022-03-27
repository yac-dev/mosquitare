import Comment from '../models/comment';

export const createComment = async (request, response) => {
  try {
    const { conversationId, userId } = request.params;
    const { content } = request.body;
    const comment = await new Comment();
    comment.content = content;
    comment.conversation = conversationId;
    comment.user = userId;
    await comment.save();
    response.status(201).json({
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};
