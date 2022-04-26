import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  userFrom: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  userTo: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  enthusiasm: Number,
  friendliness: Number,
  patience: Number,
  cooperation: Number,
  diversity: Number,
  romanceHunter: {
    checked: Boolean,
    detail: String,
  },
  moneyHunter: {
    checked: Boolean,
    detail: String,
  },
  racism: {
    checked: Boolean,
    detail: String,
  },
  // rating {enthusiastic: 10, friendly: 8, patient: 6, helpful: 5, respectCulture: 8, datingHunter: false, moneyHunter: false}
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
