export const getCountryCodeFromEarth = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    if (!response.ok) {
      throw new Error("Failed to load country data. Please try again.");
    }
    const data = await response.json();
    if (!data.countryCode) {
      throw new Error("No country found at that location.");
    }
    return data.countryCode;
  } catch (error) {
    throw new Error(error.message || "Error fetching country code.");
  }
};

export const getCountryDataFromCode = async (code) => {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/alpha/${code}`
    );
    if (!response.ok) {
      throw new Error("Failed to load country data. Please try again.");
    }
    const data = await response.json();
    if (!data || !data[0]) {
      throw new Error("Failed to load country data. Please try again.");
    }
    const obj = data[0];
    const formatted = {
      name: obj.name.common,
      capital: obj.capital[0],
      area: obj.area,
      continents: obj.continents,
      currencies: obj.currencies,
      flagUrl: obj.flags.svg,
      population: obj.population,
      languages: obj.languages,
      code: obj.cca2,
      coordinates: obj.latlng,
    };
    return formatted;
  } catch (error) {
    throw new Error(error.message || "Error fetching country details.");
  }
};

export const getAllCountryNames = async () => {
  try {
    const response = await fetch(
      "https://restcountries.com/v3.1/all?fields=name,cca2,continents"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch country list.");
    }
    const data = await response.json();
    const filtered = data
      .map((country) => ({
        name: country.name.common,
        code: country.cca2,
        continents: country.continents,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  } catch (error) {
    throw new Error(error.message);
  }
};
