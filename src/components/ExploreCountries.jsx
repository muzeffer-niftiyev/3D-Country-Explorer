import Loader from "./Loader";
import toast from "react-hot-toast";
import DataCard from "./DataCard";
import { Dices } from "lucide-react";
import { useSelector } from "react-redux";
import { filterStyle } from "../utils/miuStyle";
import ExploreSearchbar from "./ExploreSearchbar";
import { findCountryBySlug } from "../utils/slug";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelectCountry } from "../hooks/useCountrySelection";
import { MenuItem, Select, FormControl } from "@mui/material";

const REGIONS = [
  "All",
  "Europe",
  "Asia",
  "Africa",
  "South America",
  "North America",
  "Oceania",
];

const ExploreCountries = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const selectCountry = useSelectCountry();
  const theme = useSelector((state) => state.theme.theme);
  const [regionFilter, setRegionFilter] = useState("All");
  const [diceSpin, setDiceSpin] = useState(0);
  const isDataLoading = useSelector((state) => state.country.isLoading);
  const countryData = useSelector((state) => state.country.selectedCountryData);
  const allCountries = useSelector((state) => state.country.allCountries);
  const isCountryListLoading = useSelector(
    (state) => state.country.isCountryListLoading
  );

  const filteredCountries = useMemo(() => {
    if (regionFilter === "All") return allCountries;
    return allCountries.filter((country) =>
      country.continents?.some((continent) =>
        continent.toLowerCase().includes(regionFilter.toLowerCase())
      )
    );
  }, [regionFilter, allCountries]);

  const handledSlugRef = useRef(null);
  useEffect(() => {
    if (!slug || !allCountries.length || handledSlugRef.current === slug) return;
    handledSlugRef.current = slug;

    const match = findCountryBySlug(allCountries, slug);
    if (!match) {
      toast.error(`Couldn't find a country called "${slug}".`);
      navigate("/country-details", { replace: true });
      return;
    }
    if (match.code === countryData?.code) return;
    selectCountry(match.code, { replaceUrl: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, allCountries]);

  const showRandomCountry = () => {
    const pool = filteredCountries.filter((c) => c.code !== countryData?.code);
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setDiceSpin((turns) => turns + 1);
    selectCountry(pick.code);
  };

  return (
    <>
      <h1 className="font-medium text-base lg:text-xl mb-4 lg:mb-8 text-neutral-900 dark:text-[#eee]">
        Welcome to the <span className="font-bold">Countries Explorer</span>!
        Choose a country to explore by tapping the 3D Earth or selecting
        from the dropdown list.
      </h1>
      <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
        <FormControl className="w-full sm:w-[30%]">
          <Select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            sx={filterStyle(theme)}
            inputProps={{ "aria-label": "Filter by continent" }}
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
            {REGIONS.map((region) => (
              <MenuItem key={region} value={region}>
                {region}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="flex gap-3 w-full sm:w-[65%]">
          <ExploreSearchbar
            countries={filteredCountries}
            isLoading={isCountryListLoading}
          />
          <button
            type="button"
            onClick={showRandomCountry}
            disabled={!filteredCountries.length}
            title="Random country"
            aria-label={
              regionFilter === "All"
                ? "Show a random country"
                : `Show a random country in ${regionFilter}`
            }
            className="shrink-0 w-14 h-14 flex items-center justify-center rounded border-2 border-[#ccc3c3] hover:border-[#d1d5db] bg-[#fffbeb] dark:bg-[#1d1d20] text-neutral-800 dark:text-[#f3f2ef] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-600"
          >
            <Dices
              size={26}
              aria-hidden="true"
              className="transition-transform duration-500 ease-out"
              style={{ transform: `rotate(${diceSpin * 360}deg)` }}
            />
          </button>
        </div>
      </div>
      {isDataLoading ? <Loader /> : <DataCard countryData={countryData} />}
    </>
  );
};

export default ExploreCountries;
