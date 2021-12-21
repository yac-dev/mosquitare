import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  faceOrInsta: {
    type: Number,
    default: 0,
  },
  sexalHarr: {
    type: Number,
    default: 0,
  },
  racism: {
    type: Number,
    default: 0,
  },
  goodStudent: {
    type: Number,
    default: 0,
  },
  goodTeacher: {
    type: Number,
    default: 0,
  },
  goodTeacher: {
    type: Number,
    default: 0,
  },
});

const Review = mongoose.model('review', reviewSchema);

export default Review;
