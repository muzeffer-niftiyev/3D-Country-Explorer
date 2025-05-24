import {
  getAllCountryNames,
  getCountryDataFromCode,
} from "../services/services";
import {
  setFlyCoordinates,
  setIsLoading,
  setSelectedCountryData,
  toggleIsCountryChanged,
} from "../store/countrySlice";
import toast from "react-hot-toast";
import { selectStyle } from "../utils/miuStyle";
import TextField from "@mui/material/TextField";
import { useEffect, useMemo, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch, useSelector } from "react-redux";

const ExploreSearchbar = ({ regionFilter }) => {
  const dispatch = useDispatch();
  const [allCountries, setAllCountries] = useState([]);
  const theme = useSelector((state) => state.theme.theme);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const selectedCountry = useSelector(
    (state) => state.country.selectedCountryData
  );

  const onChange = (value) => {
    const getCountryData = async () => {
      try {
        dispatch(setIsLoading(true));
        const data = await getCountryDataFromCode(value);
        dispatch(setSelectedCountryData(data));
        
        if (data.coordinates) {
          dispatch(toggleIsCountryChanged());
          dispatch(
            setFlyCoordinates({
              lat: data.coordinates[0],
              lng: data.coordinates[1],
            })
          );
        }
      } catch (error) {
        dispatch(setSelectedCountryData({}));
        if (!navigator.onLine) {
          toast.error("No internet connection. Please check your network.");
        } else {
          toast.error(
            error.message || "Failed to fetch country data. Please try again."
          );
        }
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    getCountryData();
  };

  const filteredCountries = useMemo(() => {
    if (regionFilter === "All") return allCountries;
    return allCountries.filter((country) =>
      country.value.continents?.some((continent) =>
        continent.toLowerCase().includes(regionFilter.toLowerCase())
      )
    );
  }, [regionFilter, allCountries]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await getAllCountryNames();
        if (countries && countries.length) {
          const formatted = countries.map((country) => ({
            label: country.name,
            value: {
              code: country.code,
              continents: country.continents,
            },
          }));
          setAllCountries(formatted);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  return (
    <Autocomplete
      disablePortal
      className="w-[65%]"
      options={filteredCountries}
      loading={isCountriesLoading}
      getOptionLabel={(option) => option.label}
      groupBy={(option) => option.label[0].toUpperCase()}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      value={
        selectedCountry?.name && selectedCountry?.code
          ? { label: selectedCountry.name, value: selectedCountry.code }
          : null
      }
      onChange={(_, newValue) => {
        if (newValue) onChange(newValue.value.code);
      }}
      filterOptions={(options, { inputValue }) =>
        options.filter((option) =>
          option.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select a country"
          variant="outlined"
          sx={selectStyle(theme)}
        />
      )}
      componentsProps={{
        paper: {
          sx: {
            backgroundColor: theme === "light" ? "#fffbeb" : "#1d1d20",
            color: theme === "light" ? "#212121" : "#f3f2ef",
            "& .MuiAutocomplete-noOptions": {
              padding: "12px",
              color: theme === "light" ? "#212121" : "#f3f2ef",
            },
          },
        },
      }}
      renderGroup={(params) => (
        <li
          key={params.key}
          className="bg-[#fffbeb] dark:bg-[#1d1d20] text-neutral-900 dark:text-neutral-200"
        >
          <div className="bg-stone-100  dark:bg-[#161618] text-md font-semibold text-gray-700 dark:text-neutral-300 px-3 py-1">
            {params.group}
          </div>
          <ul className="py-1">{params.children}</ul>
        </li>
      )}
    />
  );
};

export default ExploreSearchbar;
