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
  languages: [mongoose.Schema.Types.Mixed],
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
  friends: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
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
