import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  videoFilename: String,
  thumbnail: String,
  userMedias: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'UserMedia',
    },
  ],
  userScripts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'UserScript',
    },
  ],
  genre: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Language',
    },
  ],
  duration: [Number],
  isPublic: Boolean,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Review',
    },
  ],

  // ------- previous design
  // calledUser: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  // },
  // calledUserMedia: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'UserMedia',
  // },
  // calledUserScript: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'UserScript',
  // },
  // recievedUser: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  // },
  // recievedUserMedia: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'UserMedia',
  // },
  // recievedUserScript: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'UserScript',
  // },
  // isConversationPublic: Boolean,
  // reviews: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'review',
  //   },
  // ],
  // duration: Number,
  // genre: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'language',
  //   },
  // ],
  // createdAt: {
  //   type: Date,
  //   default: Date.now(),
  // },
  // ---------------------

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

conversationSchema.set('toJSON', { virtuals: true });
conversationSchema.set('toObject', { virtuals: true });

conversationSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'conversation',
  localField: '_id', // 俺の何を参照してきてんの？ってこと。
});

// conversationSchema.pre(/^find/, function (next) {
//   // this.populate({
//   //   path: 'users userMedias userScripts genre'
//   // }); // こういう複数選択、ダメね。動かない。

//   // this.populate({
//   //   path: 'users',
//   //   select: 'name email',
//   // });

//   // this.populate({
//   //   path: 'genre',
//   // });

//   // next();
// });

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
