import Like from '../models/like';

export const createLike = async (request, response) => {
  try {
    const { userId, conversationId } = request.body;
    const like = await Like.create({
      user: userId,
      conversation: conversationId,
    });
    response.status(201).json({
      like,
    });
  } catch (error) {
    console.log(error);
  }
};
