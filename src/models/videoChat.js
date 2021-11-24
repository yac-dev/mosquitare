import mongoose from 'mongoose';

const videoChatSchema = new mongoose.Schema({
  // conversationId: String, // uuidが入る。→やっぱ、これいらないかな。
  calledUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  calledUserStream: {
    type: String,
  },
  recievedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }, // もしかしたらarrayにした方がいいかも。
  recievedUserStream: {
    type: String,
  },
  // textChats: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'TextChat'
  //   }
  // ] TextChatっていうschemaもおそらく作ることになるだろう。
});

const VideoChat = mongoose.model('VideoChat', videoChatSchema);
export default VideoChat;
