import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';
import bcrypt from 'bcrypt';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email.'],
  },
  password: {
    type: String,
    required: true,
  },
  passwordConfirmation: {
    type: String,
    required: true,
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
  selfIntroduction: {
    type: String,
    default: 'I just started!',
  },
  gender: {
    type: String,
    default: 'prefer not to answer',
    enum: {
      values: [
        'male',
        'female',
        'transgender male',
        'transgender female',
        'gender varient',
        'not listed',
        'prefer not to answer',
      ],
    },
  },
  job: [
    {
      type: String,
    },
  ],
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
  isAvailableNow: {
    type: Boolean,
    default: true,
  },
  isInConversation: {
    type: Boolean,
    default: false,
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
  // personalStatus: {
  //   type: Array,
  //   default: ['📘 Just started'],
  // },
  visited: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Country',
    },
  ],
  socialApps: [
    {
      appName: String,
      url: String,
    },
  ],
  ratingAverage: mongoose.Schema.Types.Mixed,
  // visitedPhoto: [[{ type: String }]],いずれ、ここにも足していくことになる。
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  // if (!this.isModified('password')) return next();

  // Delete passwordConfirm field
  this.passwordConfirmation = undefined;
  next();
});

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
    select: 'name flagPics',
  });

  this.populate({
    path: 'myLangs',
    select: 'name',
  });

  this.populate({
    path: 'visited',
    select: 'name location flagPics',
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
