import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema({
  transcript: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  language: {
    type: mongoose.Schema.ObjectId,
    ref: 'Language',
  },
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: 'Conversation',
  },
  seconds: Number,
});

transcriptSchema.index({ conversation: 1 });

const Transcript = mongoose.model('Transcript', transcriptSchema);

export default Transcript;
