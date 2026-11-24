import {
  formatArea,
  formatCurrency,
  formatPopulation,
} from "../utils/formatters";
import Flag from "./Flag";
import toast from "react-hot-toast";
import LikeButton from "./LikeButton";
import { useEffect, useState } from "react";

const Fact = ({ label, children }) => (
  <div className="min-w-0 rounded-md bg-amber-100/70 dark:bg-[#26262a] px-3 py-1.5 lg:bg-transparent lg:dark:bg-transparent lg:p-0 lg:rounded-none lg:flex lg:items-center lg:gap-2 transition-colors duration-600">
    <dt className="text-xs text-neutral-500 dark:text-neutral-400 lg:text-base lg:font-semibold lg:text-neutral-900 lg:dark:text-neutral-200">
      {label}
      <span className="hidden lg:inline">:</span>
    </dt>
    <dd className="font-bold text-sm lg:text-lg leading-snug break-words">
      {children}
    </dd>
  </div>
);

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

  const currencies = formatCurrency(countryData.currencies)
    .map(({ code, symbol }) => (symbol ? `${code} (${symbol})` : code))
    .join(", ");

  return (
    <div className="bg-amber-50 dark:bg-[#1d1d20] mt-4 lg:my-6 w-full shrink-0 overflow-x-hidden flex items-center flex-col p-4 lg:p-5 rounded-md relative text-neutral-900 dark:text-neutral-200 transition-all duration-600">
      <LikeButton countryData={countryData} />
      <div className="w-full flex items-center gap-4 pr-10 lg:pr-0 lg:flex-col lg:gap-0">
        {showImg ? (
          <Flag
            src={countryData.flagUrl}
            code={countryData.code}
            alt={`Flag of ${countryData.name}`}
            onLoad={() => setHasImgLoaded(true)}
            onError={() => setIsImgError(true)}
            className="h-16 lg:h-[140px] lg:w-full [--flag-h:4rem] lg:[--flag-h:140px] [--flag-max-w:112px] lg:[--flag-max-w:min(260px,calc(100%_-_4.5rem))]"
          />
        ) : (
          <div className="w-[112px] lg:w-[200px] text-sm lg:text-base text-gray-500 dark:text-neutral-200 flex items-center justify-center text-center px-2">
            Connect to the internet to view this country's flag.
          </div>
        )}
        <h3 className="lg:mt-3 uppercase text-lg lg:text-xl leading-tight text-neutral-900 dark:text-neutral-200 font-bold lg:text-center transition-all duration-600">
          {countryData.name}
        </h3>
      </div>

      <dl className="mt-4 lg:mt-5 lg:ml-3 w-full grid grid-cols-2 gap-2 lg:grid-cols-1">
        <Fact label="Capital">{countryData.capital}</Fact>
        <Fact label="Continent">{countryData.continents.join(", ")}</Fact>
        <Fact label="Population">
          {formatPopulation(countryData.population)}
        </Fact>
        <Fact label="Area">{formatArea(countryData.area)}</Fact>
        <Fact label="Language">
          {Object.values(countryData.languages).join(", ")}
        </Fact>
        <Fact label="Currency">{currencies}</Fact>
      </dl>
    </div>
  );
};

export default DataCard;
