import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  calledUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  calledUserMedia: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserMedia',
  },
  calledUserScript: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserScript',
  },
  recievedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  recievedUserMedia: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserMedia',
  },
  recievedUserScript: {
    type: mongoose.Schema.ObjectId,
    ref: 'UserScript',
  },
  isConversationPublic: Boolean,
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'review',
    },
  ],
  duration: Number,
  genre: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'language',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  // textChats: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'TextChats',
  // }, //ここよりも、textchats側のmodelでmount先を指定するほうがいいかもな。
  // integratedUserMedia: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'IntegratedUserMedia',
  // },
  // isVideoPublic: [Boolean],これいらないかな。二つのreviewがそれぞれscoreQuestion4でbooleanを持っているからな。

  // textChats: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'TextChat'
  //   }
  // ] TextChatっていうschemaもおそらく作ることになるだろう。→こっちでもっておくことはやっぱやめよう。one to many
});

conversationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'calledUserMedia recievedUserMedia calledUserScript recievedUserScript',
  });

  next();
});

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
