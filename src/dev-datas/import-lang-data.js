const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '../', '../', 'config/dev.env') });

// console.log(require('dotenv').config({ path: path.join(__dirname, '../', '../', 'config/dev.env') }));

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful!'));

const languages = JSON.parse(fs.readFileSync(`${__dirname}/languages.json`, 'utf-8'));
const Language = require('../models/language');
const importData = async () => {
  try {
    await Language.create(languages);
    console.log('Data imported to Hosted Database!!');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Country.deleteMany();
    console.log('Data deleted completely.');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
