import mongoose from 'mongoose';

const personalityReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  scoreOfPersonalityQuestion1: Number,
  scoreOfPersonalityQuestion2: Number,
  isPublicOk: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const PersonalityReview = mongoose.model('PersonalityReview', personalityReviewSchema);

export default PersonalityReview;
