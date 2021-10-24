import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
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
  level: [
    {
      type: Number,
      required: true,
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

const User = mongoose.model('User', userSchema);

export default User;
