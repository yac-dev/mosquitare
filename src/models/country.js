import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  flagPic: {
    type: String,
    required: true,
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

countrySchema.index({ location: '2dsphere' });

const Country = mongoose.model('Country', countrySchema);
export default Country;
