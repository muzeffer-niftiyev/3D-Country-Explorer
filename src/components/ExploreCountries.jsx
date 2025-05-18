import DataCard from "./DataCard";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import ExploreSearchbar from "./ExploreSearchbar";

const ExploreCountries = () => {
  const isDataLoading = useSelector((state) => state.country.isLoading);
  const countryData = useSelector((state) => state.country.selectedCountryData);

  return (
    <>
      <h1 className="font-medium text-xl mb-8 text-neutral-900 dark:text-[#eee]">
        Welcome to the <span className="font-bold">Countries Explorer</span>!
        Choose a country to explore by clicking on the 3D Earth or selecting
        from the dropdown list.
      </h1>
      <ExploreSearchbar />
      {isDataLoading ? <Loader /> : <DataCard countryData={countryData} />}
    </>
  );
};

export default ExploreCountries;
