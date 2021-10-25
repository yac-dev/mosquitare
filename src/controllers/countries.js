import Country from '../models/country';

export const getCountries = async (request, response) => {
  try {
    const countries = await Country.find();
    response.json(countries);
  } catch (error) {
    console.log(error);
  }
};
