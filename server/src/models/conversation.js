import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  calledUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  recievedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  integratedUserMedia: {
    type: mongoose.Schema.ObjectId,
    ref: 'IntegratedUserMedia',
  },
  // isVideoPublic: [Boolean],これいらないかな。二つのreviewがそれぞれscoreQuestion4でbooleanを持っているからな。
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'review',
    },
  ],
  duration: Number,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // textChats: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'TextChat'
  //   }
  // ] TextChatっていうschemaもおそらく作ることになるだろう。→こっちでもっておくことはやっぱやめよう。one to many
});

conversationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'integratedUserMedia',
  });

  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
