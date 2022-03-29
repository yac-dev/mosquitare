import Comment from '../models/comment';
import mongoose from 'mongoose';

export const createComment = async (request, response) => {
  try {
    const { conversationId, userId } = request.params;
    const { content } = request.body;
    console.log(content);
    let comment = await new Comment();
    comment.content = content;
    comment.conversation = conversationId;
    comment.user = userId;
    await comment.save();
    comment = await comment.populate({ path: 'user', select: '_id name flagPics', model: 'User' }); // client側でcreateした後にもpopulateする方法。
    response.status(201).json({
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getConversationComments = async (request, response) => {
  try {
    const { conversationId } = request.params;
    console.log('searching', conversationId);
    const comments = await Comment.find({ conversation: mongoose.Types.ObjectId(conversationId) }).populate({
      path: 'user',
      select: '_id name photo',
      model: 'User',
    });

    response.status(200).json({
      comments,
    });
  } catch (error) {
    console.log(error);
  }
};
