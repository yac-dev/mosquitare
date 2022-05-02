import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messageSpace: {
    type: mongoose.Schema.ObjectId,
    ref: 'MessageSpace',
  },
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  content: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  read: Boolean,
});

const Message = mongoose.model('Message', messageSchema);
export default Message;
