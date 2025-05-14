export const getCountryCodeFromEarth = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    const data = await response.json();
    return data.countryCode;
  } catch (err) {
    console.error(err);
  }
};

export const getCountryDataFromCode = async (code) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}`
    );
    const data = await response.json();
    const obj = data[0];
    const formatted = {
      name: obj.name.official,
      capital: obj.capital[0],
      area: obj.area,
      continents: obj.continents,
      currencies: obj.currencies,
      flagUrl: obj.flags.svg,
      population: obj.population,
      languages: obj.languages,
      code: obj.cca2,
    };
    return formatted;
  } catch (err) {
    console.error(err);
  }
};

export const getAllCountryNames = async () => {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const filtered = data
      .map((country) => ({
        name: country.name.official,
        code: country.cca2,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  } catch (err) {
    console.error(err);
  }
};
