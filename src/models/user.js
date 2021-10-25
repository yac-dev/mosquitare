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
  // location: {
  //   type: {
  //     type: String,
  //     enum: ['Point'],
  //     default: 'Point',
  //   },
  //   coordinates: [Number],
  // },
});

userSchema.index({ location: '2dsphere' });

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirmation = undefined;
  next();
});

userSchema.methods.isPasswordCorrect = async (enteredPassword, actualPassword) => {
  return await bcrypt.compare(enteredPassword, actualPassword);
};

const User = mongoose.model('User', userSchema);

export default User;
