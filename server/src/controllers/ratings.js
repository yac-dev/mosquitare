import Rating from '../models/rating';
import Conversation from '../models/conversation';
import User from '../models/user';

export const createRating = async (request, response) => {
  try {
    const { conversationId, userFrom, userTo } = request.params;
    const { rating } = request.body;
    const newRating = await Rating.create({
      conversation: conversationId,
      userFrom,
      userTo,
      rating,
    });

    // conversationのidをここで入れて。
    const conversation = await Conversation.findById(conversationId);
    conversation.ratings.push(newRating._id);
    // partner userのratingAverageをupdateする。
    const user = await User.findById(newRating.userTo);
    const sum = user.ratingAverage.map((value, index) => value + newRating.rating[index]);
    // 最後二つのelementに関しては、割る２しない。
    const updatedRatingAverage = [];
    for (let i = 0; i < sum.length - 2; i++) {
      updatedRatingAverage.push(Math.round((sum[i] / 2) * 10) / 10);
    }
    user.ratingAverage = updatedRatingAverage;
    response.status(200).json({
      message: 'success',
    });
  } catch (error) {
    console.log(error);
  }
};
