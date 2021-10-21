import path from 'path';
import dotenv from 'dotenv';
const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, '../', 'config/dev.env') });
// require('dotenv').config({ path: path.join(__dirname, '../', 'config/dev.env') });
// console.log(process.env.PORT);
// console.log(require('dotenv').config({ path: path.join(__dirname, '../', 'config/dev.env') }));

import app from './app';
const port = process.env.PORT;

app.listen(port, () => {
  console.log('Server listenning on port 3500');
});
