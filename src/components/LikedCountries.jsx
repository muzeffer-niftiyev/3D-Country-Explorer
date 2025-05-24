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
        <div className="h-full w-full my-4 dark:text-neutral-200 transition-colors duration-600">
          <div className="w-full flex justify-center mb-6">
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
              <p className="text-gray-500 dark:text-neutral-200 transition-colors duration-600 text-center mt-3">
                Pick a country you’ve liked to explore its details.
              </p>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 font-semibold text-lg mt-5 dark:text-neutral-200 transition-colors duration-600">
          You don't have any liked countries yet!
        </p>
      )}
    </>
  );
};

export default LikedCountries;
