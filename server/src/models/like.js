import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Like = mongoose.model('Like', likeSchema);
export default Like;
