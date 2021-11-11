import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  organizer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  language1: {
    type: mongoose.Schema.ObjectId,
    ref: 'Language',
    required: true,
  },
  language2: {
    type: mongoose.Schema.ObjectId,
    ref: 'Language',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  ],
  limit: {
    type: Number,
    default: 8,
  },
  // date: {
  //   type: Date,
  // }
});

meetingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'organizer',
    select: 'name nativeLangs learningLangs nationalities',
  });

  this.populate({
    path: 'members',
    select: 'name',
  }); // これどうなんだろう。native langsとかまでついてきている。。。
  next();
});

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
