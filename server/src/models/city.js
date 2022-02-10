import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  country: {
    type: mongoose.Schema.ObjectId,
    ref: 'Country',
  },
  name: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: [Number],
  },
});

citySchema.index({ country: 1 });

const City = mongoose.model('City', citySchema);
export default City;
