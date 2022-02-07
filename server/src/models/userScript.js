import mongoose from 'mongoose';

const userScriptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  conversationTranscriptFileName: String,
  learningLanguageScriptFileName: String,
  nativeLanguageScriptFileName: String,
});

const UserScript = mongoose.model('UserScript', userScriptSchema);

export default UserScript;
