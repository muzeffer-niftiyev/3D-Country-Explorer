import { useState } from "react";
import DataCard from "./DataCard";
import { useSelector } from "react-redux";
import LikedSearchbar from "./LikedSearchbar";

const LikedCountries = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const likedCountries = useSelector((state) => state.liked.likedCountries);
  const sortedLikedCountries = [...likedCountries].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <>
      {sortedLikedCountries.length ? (
        <div className="w-full lg:h-full lg:my-4 dark:text-neutral-200 transition-colors duration-600">
          <div className="w-full flex justify-center lg:mb-6">
            <LikedSearchbar
              sortedLikedCountries={sortedLikedCountries}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
            />
          </div>

          <div className="w-full">
            {selectedCountry ? (
              <DataCard countryData={selectedCountry} />
            ) : (
              <p className="text-sm lg:text-base text-gray-500 dark:text-neutral-200 transition-colors duration-600 text-center mt-4 lg:mt-3 mb-1">
                Pick a country you’ve liked to explore its details.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 font-semibold text-base lg:text-lg mt-2 mb-1 lg:mt-5 text-center dark:text-neutral-200 transition-colors duration-600">
          You don't have any liked countries yet!
        </p>
      )}
    </>
  );
};

export default LikedCountries;
