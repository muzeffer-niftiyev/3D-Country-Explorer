import {
  formatArea,
  formatCurrency,
  formatPopulation,
} from "../utils/formatters";
import Flag from "./Flag";
import toast from "react-hot-toast";
import LikeButton from "./LikeButton";
import { useEffect, useState } from "react";

const DataCard = ({ countryData }) => {
  const [isImgError, setIsImgError] = useState(false);
  const [hasImgLoaded, setHasImgLoaded] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      toast.success("Reconnected to the internet!");
      setIsOnline(true);
    };
    const handleOffline = () => {
      toast.error("Internet connection lost!");
      setIsOnline(false);
    };
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    setIsImgError(false);
    setHasImgLoaded(false);
  }, [countryData.flagUrl]);

  const showImg = hasImgLoaded || (isOnline && !isImgError);
  if (!countryData || Object.keys(countryData).length === 0) return null;

  return (
    <div className="bg-amber-50 dark:bg-[#1d1d20] my-6 w-full shrink-0 overflow-x-hidden flex items-center flex-col p-5 rounded-md relative text-neutral-900 dark:text-neutral-200 transition-all duration-600">
      <LikeButton countryData={countryData} />
      {showImg ? (
        <Flag
          src={countryData.flagUrl}
          code={countryData.code}
          alt={`Flag of ${countryData.name}`}
          onLoad={() => setHasImgLoaded(true)}
          onError={() => setIsImgError(true)}
        />
      ) : (
        <div className="w-[200px] text-gray-500 dark:text-neutral-200 flex items-center justify-center text-md text-center px-2">
          Connect to the internet to view this country's flag.
        </div>
      )}
      <h3 className="mt-3 uppercase text-xl text-neutral-900 dark:text-neutral-200 font-bold text-center transition-all duration-600">
        {countryData.name}
      </h3>

      <div className="mt-5 ml-3 w-full grid grid-cols-1 gap-2 max-h-screen">
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
            <p key={currency.code} className="font-bold text-lg">
              {currency.code}
              {currency.symbol ? ` (${currency.symbol})` : ""}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DataCard;
