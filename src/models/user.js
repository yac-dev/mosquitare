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
  languages: [
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
  },
  histories: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
});

const User = mongoose.model('User', userSchema);

export default User;
