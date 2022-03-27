import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  genre: {
    type: String,
    default: 'message',
    enum: ['messgae', 'advice'],
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
