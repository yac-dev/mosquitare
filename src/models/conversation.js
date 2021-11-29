import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  calledUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  // calledUserVideo: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Video',
  // },
  recievedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  // recievedUserVideo: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'Video',
  // },
  integratedUserMedia: {
    type: mongoose.Schema.ObjectId,
    ref: 'IntegratedUserMedia',
  },
  // isVideoPublic: [Boolean],これいらないかな。二つのreviewがそれぞれscoreQuestion4でbooleanを持っているからな。
  reviws: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'review',
    },
  ],
  duration: Number,
  // textChats: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'TextChat'
  //   }
  // ] TextChatっていうschemaもおそらく作ることになるだろう。→こっちでもっておくことはやっぱやめよう。one to many
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
