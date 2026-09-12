const REST_COUNTRIES_API_URL = import.meta.env.PROD
  ? "https://api.restcountries.com/countries/v5"
  : "/api/countries";
const REST_COUNTRIES_API_KEY = import.meta.env.REST_COUNTRIES_API_KEY;

const fetchRestCountries = async (path = "", params = {}) => {
  if (import.meta.env.PROD && !REST_COUNTRIES_API_KEY) {
    throw new Error("REST_COUNTRIES_API_KEY is not configured for this deployment.");
  }

  const searchParams = new URLSearchParams(params);
  const query = searchParams.toString();
  const response = await fetch(`${REST_COUNTRIES_API_URL}${path}${query ? `?${query}` : ""}`, {
    headers: import.meta.env.PROD
      ? { Authorization: `Bearer ${REST_COUNTRIES_API_KEY}` }
      : undefined,
  });
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      "The country API returned a non-JSON response. Check the REST Countries API configuration.",
    );
  }

  const result = await response.json();
  if (!response.ok) {
    throw new Error(
      result.errors?.[0]?.message || "Failed to load country data. Please try again.",
    );
  }

  return result.data;
};

const normalizeCountry = (country) => ({
  name: country.names?.common,
  capital: country.capitals?.[0]?.name || "N/A",
  area: country.area?.kilometers,
  continents: country.continents || [],
  currencies: Object.fromEntries(
    (country.currencies || []).map((currency) => [currency.code, currency]),
  ),
  flagUrl: country.flag?.url_svg,
  population: country.population,
  languages: Object.fromEntries(
    (country.languages || []).map((language) => [language.bcp47, language.name]),
  ),
  code: country.codes?.alpha_2,
  coordinates: country.coordinates ? [country.coordinates.lat, country.coordinates.lng] : [],
});

export const getCountryCodeFromEarth = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`,
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
    const data = await fetchRestCountries(`/codes.alpha_2/${code}`, {
      response_fields:
        "names.common,codes.alpha_2,capitals,area.kilometers,continents,currencies,flag.url_svg,population,languages,coordinates",
    });
    const country = data?.objects?.[0];
    if (!country) {
      throw new Error("Failed to load country data. Please try again.");
    }
    return normalizeCountry(country);
  } catch (error) {
    throw new Error(error.message || "Error fetching country details.");
  }
};

export const getAllCountryNames = async () => {
  try {
    const countries = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const data = await fetchRestCountries("", {
        limit: 100,
        offset,
        response_fields: "names.common,codes.alpha_2,continents",
      });
      countries.push(...(data?.objects || []));
      hasMore = data?.meta?.more === true;
      offset += data?.meta?.count || 100;
    }

    return countries
      .map((country) => ({
        name: country.names.common,
        code: country.codes.alpha_2,
        continents: country.continents,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    throw new Error(error.message || "Failed to fetch country list.");
  }
};
