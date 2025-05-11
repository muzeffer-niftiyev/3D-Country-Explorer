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
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
  }
};

export const getAllCountryNames = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name"
    );
    const data = await response.json();
    const countryNames = data.map((item) => item.name.common);
    return countryNames.sort();
  } catch (err) {
    console.error(err);
  }
};
