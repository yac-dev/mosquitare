import mongoose from 'mongoose';

const userMediaSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  videoFileName: String,
  audioFileName: String,
});

const UserMedia = mongoose.model('UserMedia', userMediaSchema);

export default UserMedia;
