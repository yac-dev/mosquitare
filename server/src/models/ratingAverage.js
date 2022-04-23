import mongoose from 'mongoose';

const ratingAverageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  enthusiasm: {
    type: Number,
    default: 0,
  },
  friendliness: {
    type: Number,
    default: 0,
  },
  patience: {
    type: Number,
    default: 0,
  },
  cooperation: {
    type: Number,
    default: 0,
  },
  diversity: {
    type: Number,
    default: 0,
  },
  romanceHunter: {
    type: Number,
    default: 0,
  },
  moneyHunter: {
    type: Number,
    default: 0,
  },
  racism: {
    type: Number,
    default: 0,
  },
});

const RatingAverage = mongoose.model('RatingAverage', ratingAverageSchema);
export default RatingAverage;
