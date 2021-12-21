import PenaltyReview from '../models/penaltyReview';
import PersonalityReview from '../models/personalityReview';
import User from '../models/user';

// 物語としては、ここでpostする前にvideosでvideo fileをpostするようなことになるだろな。→いや。違う。reviewするときにpublic or privateを聞くんだ。だから、reviewの時のタイミングだ。おそらく。videoをpublicにするかしないかは二者のobjectをとってこないと無理ですわ。
export const createReview = async (request, response) => {
  try {
    const {
      userId, // ここ、idでいいね。user全体の情報を渡す必要はない。少し紛らわしいけど。
      scoreOfPenaltyQuestion1,
      scoreOfPenaltyQuestion2,
      scoreOfPenaltyQuestion3,
      videoProof,
      scoreOfPersonalityQuestion1,
      scoreOfPersonalityQuestion2,
      isPublicOk,
    } = request.body;

    const penaltyReview = await new PenaltyReview({
      user: userId,
      scoreOfPenaltyQuestion1,
      scoreOfPenaltyQuestion2,
      scoreOfPenaltyQuestion3,
    });
    penaltyReview.save();

    const personalityReview = await new PersonalityReview({
      user: userId,
      scoreOfPersonalityQuestion1,
      scoreOfPersonalityQuestion2,
      isPublicOk,
    });
    personalityReview.save();

    const user = await User.findById(userId);
    user.penaltyReviews.push(penaltyReview);
    user.personalityReviews.push(personalityReview);
    // 30日以内って、どう書くんだろ。。。。ここの部分はまた後だな。
    user.pendingPenalty.push(penaltyReview);
    response.json({
      penaltyReview,
      personalityReview,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
