import Like from '../models/like';
import mongoose from 'mongoose';

export const createLike = async (request, response) => {
  try {
    const { userId, conversationId } = request.body;
    const like = await Like.create({
      user: userId,
      conversation: conversationId,
      createdAt: new Date(),
    });
    response.status(201).json({
      like,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getConversationLikes = async (request, response) => {
  try {
    const likes = await Like.find({ conversation: mongoose.Types.ObjectId(request.params.conversationId) });
    response.status(200).json({
      likes,
    });
  } catch (error) {
    console.log(error);
  }
};

export const aggregateAllLikes = async (request, response) => {
  try {
    const allLikesStat = await Like.aggregate([
      {
        $group: {
          _id: '$conversation',
          nums: { $sum: 1 },
        },
      },
    ]);
    response.status(200).json({
      allLikesStat,
    });
  } catch (error) {
    console.log(error);
  }
};

// export const aggregateMyLikes = async (request, response) => {
//   try {
//     const likeStats = await Like.aggregate([
//       {
//         $match: { conversation: { $elemMatch: {$conversation} } },
//       },
//     ]);
//   } catch (error) {
//     console.log(error);
//   }
// };
