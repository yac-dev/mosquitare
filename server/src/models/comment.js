import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
  },
  genre: {
    type: String,
    default: 'message',
    enum: {
      values: ['message', 'feedback'],
      massgae: 'Please select either message or advice.',
    },
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
  },
});

// commentSchema.set('toJSON', { virtuals: true });
// commentSchema.set('toObject', { virtuals: true });
// commentSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'user',
//   });

//   next();
// });

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
