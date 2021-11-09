import mongoose from 'mongoose';
// import bcrypt from 'bcryptjs';

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
  averageDuration: {
    type: Number,
    default: 0,
  },
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

// userSchema.pre('save', async function (next) {
//   this.password = await bcrypt.hash(this.password, 12);
//   this.passwordConfirmation = undefined;
//   next();
// });

userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'nativeLangs',
    select: 'name code',
  });

  this.populate({
    path: 'learningLangs',
    select: 'name code',
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
