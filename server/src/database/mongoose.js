import mongoose from 'mongoose';
import { MONGODB_URL } from '../../config';

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('👍 Database connection succeeded 👍');
  })
  .catch((error) => {
    console.log('💩 Database connection failed... 💩');
    console.log(error);
  });
