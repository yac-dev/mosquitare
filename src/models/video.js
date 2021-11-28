import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  videoFile: String,
  audioFile: String,
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
