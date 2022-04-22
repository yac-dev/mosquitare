import Rating from '../models/rating';
import Conversation from '../models/conversation';
import User from '../models/user';

export const createRating = async (request, response) => {
  try {
    const { conversationId, userFrom, userTo, rating } = request.body;
    const newRating = await Rating.create({
      conversation: conversationId,
      userFrom,
      userTo,
      rating,
    });

    // このconversationで、どんなratingが来たか保存する。
    const conversation = await Conversation.findById(conversationId);
    conversation.ratings.push(newRating._id);
    await conversation.save();
    // こっから、partner userのratingAverageをupdateする。
    const user = await User.findById(userTo);
    // user.ratingAverageのhash table。
    // {"enthusiastic": 10, "friendly": 9, "patient": 8, "helpful": 7, "respectCulture": 6, "datingHunter": 1, "moneyHunter": 0}っていうdata structureを持っているとして。。。
    // ['enthusiastic','friendly', 'patient', 'helpful', 'respectCulture','datingHunter', 'moneyHunter']
    const newA = Object.keys(user.ratingAverage);
    Object.keys(user.ratingAverage).forEach((status) => {
      if (status === 'datingHunter') {
        if (rating[status]) {
          user.ratingAverage[status] = user.ratingAverage[status] + 1;
        }
      } else if (status === 'moneyHunter') {
        if (rating[status]) {
          user.ratingAverage[status] = user.ratingAverage[status] + 1;
        }
      } else if (status === 'numberHunter') {
        user.ratingAverage[status] = user.ratingAverage[status] + 1;
      } else {
        user.ratingAverage[status] = Math.round(((user.ratingAverage[status] + rating[status]) / 2) * 10) / 10;
      }
    });
    user.markModified('ratingAverage');
    await user.save({ validateBeforeSave: false });

    response.status(200).json({
      message: 'success',
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
