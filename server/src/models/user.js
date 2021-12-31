import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirmation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
  },
  nativeLangs: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Language',
    },
  ],
  // learningLangs: [mongoose.Schema.Types.Mixed],
  learningLangs: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Language',
    },
  ],
  nationalities: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Country',
    },
  ],
  penaltyReviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'PenaltyReview',
    },
  ],
  personalityReviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'PersonalityReview',
    },
  ],
  pendingPenalty: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'PenaltyReview',
    },
  ], // こっちは月毎にupdate。
  degrees: [String],
  job: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'No description.',
  },
  conversations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation',
    },
  ],
  talkedWith: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  },
  socketId: {
    type: String,
    default: '',
  },
  isOnline: {
    type: Boolean,
    default: true,
  },
  isInConversation: {
    type: Boolean,
    default: false,
  },
  voiceTexts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'VoiceText',
    },
  ],
  videos: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Video',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.index({ location: '2dsphere' });

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(this.password, 12);
//   this.passwordConfirmation = undefined;
//   next();
// });

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'nativeLangs',
    select: 'name code codeForSpeechRecognition',
  });

  this.populate({
    path: 'learningLangs',
    select: 'name code codeForSpeechRecognition',
  });

  this.populate({
    path: 'nationalities',
    select: 'name flagPic',
  });
  next();
});

userSchema.methods.isPasswordCorrect = async (enteredPassword, actualPassword) => {
  return await bcrypt.compare(enteredPassword, actualPassword);
}; // 多分、bcryptjsのmodule自体がぶっ壊れてるな。。。

const User = mongoose.model('User', userSchema);

export default User;
