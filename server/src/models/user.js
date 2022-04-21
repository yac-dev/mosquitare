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
  // nativeLangs: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     required: true,
  //     ref: 'Language',
  //   },
  // ],
  nativeLangs: [
    {
      language: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Language',
      },
      status: {
        type: Number,
        default: 0,
      },
    },
  ],
  // learningLangs: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     required: true,
  //     ref: 'Language',
  //   },
  // ],
  learningLangs: [
    {
      language: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Language',
      },
      status: {
        type: Number,
        default: 0,
      },
    },
  ],
  // myLangs: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Language',
  //   },
  // ],
  // myLangsStatus: [
  //   {
  //     type: Number,
  //     default: [0, 0],
  //   },
  // ],
  // langsStatusHistory: [[Number]],
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
  visited: [
    {
      country: {
        type: mongoose.Schema.ObjectId,
        ref: 'Country',
      },
      // photos: [
      //   {
      //     type: mongoose.Schema.ObjectId,
      //   }
      // ] // ここは、virtualでいいや。
    },
  ],
  socialApps: [
    {
      appName: String,
      url: String,
    },
  ],
  ratingAverage: {
    enthusiastic: {
      type: Number,
      default: 0,
    },
    friendly: {
      type: Number,
      default: 0,
    },
    patient: {
      type: Number,
      default: 0,
    },
    helpful: {
      type: Number,
      default: 0,
    },
    respectCulture: {
      type: Number,
      default: 0,
    },
    datingHunter: {
      type: Number,
      default: 0,
    },
    moneyHunter: {
      type: Number,
      default: 0,
    },
  },
  // visitedPhoto: [[{ type: String }]],いずれ、ここにも足していくことになる。
  // pendingPenalty: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'PenaltyReview',
  //   },
  // ], // こっちは月毎にupdate。
  // personalStatus: {
  //   type: Array,
  //   default: ['📘 Just started'],
  // },
  // visited: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     ref: 'Country',
  //   },
  // ],
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

// ここのpopulate、一回comment outしておく。
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'nativeLangs.language',
    select: 'name code codeForSpeechRecognition',
  });

  this.populate({
    path: 'learningLangs.language',
    select: 'name code codeForSpeechRecognition',
  });

  this.populate({
    path: 'nationalities',
    select: 'name flagPics',
  });

  // this.populate({
  //   path: 'myLangs',
  //   select: 'name',
  // });

  this.populate({
    path: 'visited.country',
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
