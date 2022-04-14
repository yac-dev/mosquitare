import mongoose from 'mongoose';

const mailSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  read: Boolean,
});

const Mail = mongoose.model('Mail', mailSchema);
export default Mail;
