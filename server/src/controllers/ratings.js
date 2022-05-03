import Rating from '../models/rating';
import Conversation from '../models/conversation';
import User from '../models/user';
import RatingAverage from '../models/ratingAverage';

export const createRating = async (request, response) => {
  try {
    const { conversationId, userFrom, userTo, ratingData } = request.body;
    console.log(ratingData);
    const doesRatingExist = await Rating.findOne({ conversation: conversationId, userFrom });
    if (doesRatingExist) {
      return new Error('You have already rated.');
    }
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
    console.log(ratingAverage);
    // user.ratingAverageのhash table。
    // {"enthusiastic": 10, "friendly": 9, "patient": 8, "helpful": 7, "respectCulture": 6, "datingHunter": 1, "moneyHunter": 0}っていうdata structureを持っているとして。。。

    // ['_id','user','enthusiasm','friendliness', 'patience', 'cooperation', 'diversity','romanceHunter', 'moneyHunter', 'racism', '_v']
    // const arr = Object.keys(ratingAverage.toJSON());
    // console.log(arr);
    Object.keys(ratingAverage.toJSON()).forEach((status) => {
      if (status === 'romanceHunter') {
        if (ratingData['romanceHunter']['checked']) {
          ratingAverage.romanceHunter += 1;
        }
      } else if (status === 'moneyHunter') {
        if (ratingData['moneyHunter']['checked']) {
          ratingAverage.moneyHunter += 1;
        }
      } else if (status === 'racism') {
        if (ratingData['racism']['checked']) {
          ratingAverage.racism += 1;
        }
      } else if (status === 'enthusiasm') {
        if (ratingAverage.enthusiasm === 0) {
          ratingAverage.enthusiasm = ratingData['enthusiasm'];
        } else {
          ratingAverage.enthusiasm = Math.round(((ratingAverage.enthusiasm + ratingData['enthusiasm']) / 2) * 10) / 10;
        }
      } else if (status === 'friendliness') {
        if (ratingAverage.friendliness === 0) {
          ratingAverage.friendliness = ratingData['friendliness'];
        } else {
          ratingAverage.friendliness =
            Math.round(((ratingAverage.friendliness + ratingData['friendliness']) / 2) * 10) / 10;
        }
      } else if (status === 'patience') {
        if (ratingAverage.patience === 0) {
          ratingAverage.patience = ratingData['patience'];
        } else {
          ratingAverage.patience = Math.round(((ratingAverage.patience + ratingData['patience']) / 2) * 10) / 10;
        }
      } else if (status === 'cooperation') {
        if (ratingAverage.cooperation === 0) {
          ratingAverage.cooperation = ratingData['cooperation'];
        } else {
          ratingAverage.cooperation =
            Math.round(((ratingAverage.cooperation + ratingData['cooperation']) / 2) * 10) / 10;
        }
      } else if (status === 'diversity') {
        if (ratingAverage.diversity === 0) {
          ratingAverage.diversity = ratingData['diversity'];
        } else {
          ratingAverage.diversity = Math.round(((ratingAverage.diversity + ratingData['diversity']) / 2) * 10) / 10;
        }
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
    // console.log(error);
    response.status(400).json({
      error,
    });
  }
};
