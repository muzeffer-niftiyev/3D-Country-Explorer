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
    <div className="bg-[#fcfcfc] my-10 w-full flex items-center flex-col py-5 px-3">
      <img
        src={countryData.flagUrl}
        alt="flag"
        className="w-[170px] h-[100px] object-cover border-4 border-neutral-800"
      />
      <h3 className="mt-3 uppercase text-lg text-gray-900 font-bold text-center">
        {countryData.name}
      </h3>

      <div className="grid grid-cols-[1fr_1fr] gap-x-8 gap-y-6 mt-5 w-full">
        <div className="flex gap-2 items-center w-full">
          <p className="font-semibold text-md">Capital: </p>
          <p className="font-bold text-lg">{countryData.capital}</p>
        </div>

        <div className="flex gap-2 items-center w-full">
          <p className="font-semibold text-md">Continent: </p>
          <p className="font-bold text-lg">
            {countryData.continents.join(", ")}
          </p>
        </div>

        <div className="flex gap-2 items-center w-full">
          <p className="font-semibold text-md">Population: </p>
          <p className="font-bold text-lg">
            {formatPopulation(countryData.population)}
          </p>
        </div>

        <div className="flex gap-2 items-center w-full">
          <p className="font-semibold text-md">Area: </p>
          <p className="font-bold text-lg">{formatArea(countryData.area)}</p>
        </div>

        <div className="flex gap-2 items-center w-full">
          <p className="font-semibold text-md">Language: </p>
          <p className="font-bold text-lg">
            {Object.values(countryData.languages).join(", ")}
          </p>
        </div>

        <div className="flex gap-2 items-center w-full">
          <p className="font-semibold text-md">Currency: </p>
          {formatCurrency(countryData.currencies).map((currency) => (
            <p key={currency.name} className="font-bold text-lg">
              {currency.code} ({currency.symbol})
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataCard;
