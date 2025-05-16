import LikeButton from "./LikeButton";
import {
  formatArea,
  formatCurrency,
  formatPopulation,
} from "../utils/formatters";

const DataCard = ({ countryData }) => {
  if (!countryData || Object.keys(countryData).length === 0) return null;

  return (
    <div className="bg-[#fcfcfc] my-10 w-full flex items-center flex-col py-5 px-3 rounded-md relative">
      <LikeButton countryData={countryData} />
      <img
        src={countryData.flagUrl}
        alt="flag"
        className="w-[200px] h-[120px] object-cover rounded-2xl border-4 border-neutral-800"
      />
      <h3 className="mt-3 uppercase text-lg text-gray-900 font-bold text-center">
        {countryData.name}
      </h3>

      <div className="mt-5 w-full flex gap-2 flex-col">
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
