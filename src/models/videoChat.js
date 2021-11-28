import mongoose from 'mongoose';

const videoChatSchema = new mongoose.Schema({
  calledUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  calledUserVideo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Video',
  },
  recievedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }, // もしかしたらarrayにした方がいいかも。
  recievedUserVideo: {
    type: mongoose.Schema.ObjectId,
    ref: 'Video',
  },
  isVideoPublic: [Boolean],
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

const VideoChat = mongoose.model('VideoChat', videoChatSchema);
export default VideoChat;
