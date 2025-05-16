import { useState } from "react";
import { useSelector } from "react-redux";
import DataCard from "./DataCard";

const FavouriteCountries = () => {
  const likedCountries = useSelector((state) => state.liked.likedCountries);
  const [selectedCountry, setSelectedCountry] = useState(null);

  return (
    <div className="flex h-full w-full my-4">
      <div className="w-[30%] border-r pr-2">
        <h2 className="text-xl font-semibold mb-4">Liked Countries</h2>
        <div className="h-[90%] overflow-y-auto">
          {likedCountries.map((country) => (
            <p
              key={country.code}
              className={`w-full p-2 rounded cursor-pointer hover:bg-blue-100 ${
                selectedCountry?.code === country.code
                  ? "bg-blue-50 font-medium"
                  : ""
              }`}
              onClick={() => setSelectedCountry(country)}
            >
              {country.name}
            </p>
          ))}
        </div>
      </div>

      <div className="w-[70%] pl-2">
        {selectedCountry ? (
          <DataCard countryData={selectedCountry} />
        ) : (
          <p className="text-gray-500">
            Select a country from the left to view its details.
          </p>
        )}
      </div>
    </div>
  );
};

export default FavouriteCountries;
