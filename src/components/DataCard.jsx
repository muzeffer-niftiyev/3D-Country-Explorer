import { useSelector } from "react-redux";

const DataCard = () => {
  const countryData = useSelector((state) => state.country.selectedCountryData);

  const formatPopulation = (population) => {
    if (population >= 1000000000) {
      return (population / 1000000000).toFixed(2) + " Billion";
    } else if (population >= 1000000) {
      return (population / 1000000).toFixed(2) + " Million";
    }
    return population;
  };

  const formatArea = (area) => {
    if (area >= 1000000) {
      return (area / 1000000).toFixed(2) + " Million km²";
    }
    return area + " km²";
  };

  const formatCurrency = (currency) => {
    const currencyEntry = Object.entries(currency);
    const formatted = currencyEntry.map(([code, { symbol }]) => ({
      code,
      symbol,
    }));

    return formatted;
  };
  if (!countryData || Object.keys(countryData).length === 0) return null;

  return (
    <div className="bg-[#fff8f0] my-10 w-full flex items-center flex-col py-5 px-3">
      <img
        src={countryData.flagUrl}
        alt="flag"
        className="w-[170px] h-[100px] object-cover border-4 border-neutral-800"
      />
      <h3 className="mt-3 uppercase text-lg text-gray-900 font-bold text-center">
        {countryData.name}
      </h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-6 mt-5">
        <div className="flex gap-2 items-center">
          <p className="font-bold text-lg">Capital: </p>
          <p className="font-semibold text-md">{countryData.capital}</p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-bold text-lg">Continent: </p>
          <p className="font-semibold text-md">
            {countryData.continents.join(", ")}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-bold text-lg">Population: </p>
          <p className="font-semibold text-md">
            {formatPopulation(countryData.population)}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-bold text-lg">Area: </p>
          <p className="font-semibold text-md">
            {formatArea(countryData.area)}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-bold text-lg">Language: </p>
          <p className="font-semibold text-md">
            {Object.values(countryData.languages).join(", ")}
          </p>
        </div>

        <div className="flex gap-2 items-center">
          <p className="font-bold text-lg">Currency: </p>
          {formatCurrency(countryData.currencies).map((currency) => (
            <p key={currency.name} className="font-semibold text-md">
              {currency.code} ({currency.symbol})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataCard;
