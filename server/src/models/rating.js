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
  rating: [Number],
});

const Rating = mongoose.model('Rating', ratingSchema);

export default Rating;
