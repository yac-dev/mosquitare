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
  photo: {
    type: String,
  },
  nativeLangs: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Language',
    },
  ],
  learningLangs: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Language',
    },
  ],
  myLangs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Language',
    },
  ],
  myLangsStatus: [
    {
      type: Number,
      default: [0, 0],
    },
  ],
  langsStatusHistory: [[Number]],
  nationalities: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Country',
    },
  ],
  job: {
    type: String,
  },
  selfIntroduction: {
    type: String,
    maxlength: 70,
    default: 'No description.',
  },
  conversations: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Conversation',
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
  isReady: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  pendingPenalty: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'PenaltyReview',
    },
  ], // こっちは月毎にupdate。
  personalStatus: {
    type: Array,
    default: ['Just started 📚'],
  },
  talkedWith: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
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

  this.populate({
    path: 'myLangs',
    select: 'name flagPic',
  });

  // this.populate({
  //   path: 'conversations',
  // });

  next(); // これを全てfind側に入れるべきかな。。。
});

userSchema.methods.isPasswordCorrect = async (enteredPassword, actualPassword) => {
  return await bcrypt.compare(enteredPassword, actualPassword);
}; // 多分、bcryptjsのmodule自体がぶっ壊れてるな。。。

const User = mongoose.model('User', userSchema);

export default User;
