import Rating from '../models/rating';
import Conversation from '../models/conversation';
import User from '../models/user';
import RatingAverage from '../models/ratingAverage';

export const createRating = async (request, response) => {
  try {
    const { conversationId, userFrom, userTo, ratingData } = request.body;
    const newRating = await Rating.create({
      conversation: conversationId,
      userFrom,
      userTo,
      enthusiasm: ratingData.enthusiasm,
      friendliness: ratingData.friendliness,
      patience: ratingData.patience,
      cooperation: ratingData.cooperation,
      diversity: ratingData.diversity,
      romanceHunter: ratingData.romanceHunter,
      moneyHunter: ratingData.moneyHunter,
      racism: ratingData.racism,
    });

    // このconversationで、どんなratingが来たか保存する。
    const conversation = await Conversation.findById(conversationId);
    conversation.ratings.push(newRating._id);
    await conversation.save();
    // こっから、partner userのratingAverageをupdateする。
    const user = await User.findById(userTo);
    const ratingAverage = await RatingAverage.findOne({ user: userTo });
    // user.ratingAverageのhash table。
    // {"enthusiastic": 10, "friendly": 9, "patient": 8, "helpful": 7, "respectCulture": 6, "datingHunter": 1, "moneyHunter": 0}っていうdata structureを持っているとして。。。
    // ['enthusiastic','friendly', 'patient', 'helpful', 'respectCulture','datingHunter', 'moneyHunter']
    Object.keys(ratingAverage).forEach((status) => {
      if (status === 'romanceHunter') {
        if (ratingData[status].checked) {
          ratingAverage[status] += 1;
        }
      } else if (status === 'moneyHunter') {
        if (ratingData[status].checked) {
          ratingAverage[status] += 1;
        }
      } else if (status === 'racism') {
        if (ratingData[status].checked) {
          ratingAverage[status] += 1;
        }
      } else {
        ratingAverage[status] = Math.round(((ratingAverage[status] + ratingData[status]) / 2) * 10) / 10;
      }
    });
    // user.markModified('ratingAverage');
    // await user.save({ validateBeforeSave: false });
    await ratingAverage.save();

    response.status(200).json({
      message: 'success',
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
