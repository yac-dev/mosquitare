import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
  // languages: [
  //   {
  //     type: mongoose.Schema.ObjectId,
  //     required: true,
  //     ref: 'Language',
  //   },
  // ],
  // languages: [
  //   {
  //     type: {
  //       type: mongoose.Schema.ObjectId,
  //       required: true,
  //       ref: 'Language',
  //     },
  //     of: Number,
  //   },
  // ],
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
  // level: [
  //   {
  //     type: Number,
  //     required: true,
  //   },
  // ],
  nationalities: [
    {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'Country',
    },
  ],
  job: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: 'No description.',
  },
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  durations: [Number],
  averageDuration: Number,
  // friends: [mongoose.Schema.Types.Mixed],
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
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'nativeLangs',
    select: 'name',
  });

  this.populate({
    path: 'learningLangs',
    select: 'name',
  });

  this.populate({
    path: 'nationalities',
    select: 'name flagPic',
  });
  next();
});

userSchema.methods.isPasswordCorrect = async (enteredPassword, actualPassword) => {
  // const x = await bcrypt.hash(enteredPassword, 12);
  // console.log(x);
  // console.log(actualPassword);
  return await bcrypt.compare(enteredPassword, actualPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
