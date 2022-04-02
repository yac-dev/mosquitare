import mongoose from 'mongoose';

const docSchema = new mongoose.Schema({
  data: Object,
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Doc = mongoose.model('Doc', docSchema);

export default Doc;
