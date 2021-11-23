import mongoose from 'mongoose';

const penaltyReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  scoreOfPenaltyQuestion1: Number,
  scoreOfPenaltyQuestion2: Number,
  scoreOfPenaltyQuestion3: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  videoProof: String,
});

const PenaltyReview = mongoose.model('PenaltyReview', penaltyReviewSchema);

export default PenaltyReview;
