import mongoose from 'mongoose';

const languageStatusSchema = new mongoose.Schema({
  learningLanguageStatus: {
    type: Number,
  },
  nativeLanguageStatus: {
    type: Number,
  },
});

const LanguageStatus = mongoose.model('LanguageStatus', languageStatusSchema);

export default LanguageStatus;
