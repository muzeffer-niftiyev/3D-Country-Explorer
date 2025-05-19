import DataCard from "./DataCard";
import { useSelector } from "react-redux";
import Loader from "./Loader";
import ExploreSearchbar from "./ExploreSearchbar";
import { useState } from "react";
import { MenuItem, Select, FormControl } from "@mui/material";
import { filterStyle } from "../utils/miuStyle";

const ExploreCountries = () => {
  const isDataLoading = useSelector((state) => state.country.isLoading);
  const countryData = useSelector((state) => state.country.selectedCountryData);
  const [regionFilter, setRegionFilter] = useState("All");
  const theme = useSelector((state) => state.theme.theme);
  return (
    <>
      <h1 className="font-medium text-xl mb-8 text-neutral-900 dark:text-[#eee]">
        Welcome to the <span className="font-bold">Countries Explorer</span>!
        Choose a country to explore by clicking on the 3D Earth or selecting
        from the dropdown list.
      </h1>
      <div className="flex justify-center gap-4 w-full">
        <FormControl className="w-[30%]">
          <Select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            sx={filterStyle(theme)}
            MenuProps={{
              PaperProps: {
                sx: {
                  backgroundColor: theme === "light" ? "#fffbeb" : "#1d1d20",
                  color: theme === "light" ? "#212121" : "#f3f2ef",
                  boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.1)",
                },
              },
              MenuListProps: {
                sx: {
                  paddingY: 0.5,
                },
              },
            }}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Europe">Europe</MenuItem>
            <MenuItem value="Asia">Asia</MenuItem>
            <MenuItem value="Africa">Africa</MenuItem>
            <MenuItem value="South America">South America</MenuItem>
            <MenuItem value="North America">North America</MenuItem>
            <MenuItem value="Oceania">Oceania</MenuItem>
          </Select>
        </FormControl>
        <ExploreSearchbar regionFilter={regionFilter} />
      </div>
      {isDataLoading ? <Loader /> : <DataCard countryData={countryData} />}
    </>
  );
};

export default ExploreCountries;
