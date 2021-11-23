import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoFile: String,
  isPublic: Boolean,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  partner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
