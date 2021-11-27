import mongoose from 'mongoose';

const videoChatSchema = new mongoose.Schema({
  // conversationId: String, // uuidが入る。→やっぱ、これいらないかな。
  calledUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  callerStreamFileName: String,
  recievedUser: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }, // もしかしたらarrayにした方がいいかも。
  recieverStreamFileName: String,
  // textChats: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'TextChat'
  //   }
  // ] TextChatっていうschemaもおそらく作ることになるだろう。
});

const VideoChat = mongoose.model('VideoChat', videoChatSchema);
export default VideoChat;
