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

let countries = JSON.parse(fs.readFileSync(`${__dirname}/countries.json`, 'utf-8'));

const arrageCountries = (countries) => {
  const newCountriesArr = [];
  for (let i = 0; i < countries.length; i++) {
    let countryInfo = {};
    countryInfo.flagPic = countries[i].flags.png;
    countryInfo.name = countries[i].name.common;
    countryInfo.location = {
      type: 'Point',
      coordinates: countries[i].latlng.reverse(),
    };
    // countryInfo.flagStr = countries[i].flag;
    newCountriesArr.push(countryInfo);
  }
  return newCountriesArr;
};
const arrangedCountries = arrageCountries(countries);
// console.log(arrangedCountries); // ok

const Country = require('../models/country');
const importData = async () => {
  try {
    await Country.create(arrangedCountries);
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
