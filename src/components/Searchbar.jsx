import { useDispatch, useSelector } from "react-redux";
import {
  setFlyCoordinates,
  setIsLoading,
  setSelectedCountryData,
  toggleIsCountryChanged,
} from "../store/countrySlice";
import { useEffect, useState } from "react";
import {
  getAllCountryNames,
  getCountryDataFromCode,
} from "../services/services";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const Searchbar = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const dispatch = useDispatch();
  const selectedCountry = useSelector(
    (state) => state.country.selectedCountryData
  );
  const theme = useSelector((state) => state.theme.theme);

  const onChange = (value) => {
    const getCountryData = async () => {
      try {
        dispatch(setIsLoading(true));
        const data = await getCountryDataFromCode(value);
        if (data) {
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
        } else {
          console.log("Error setting country code");
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    getCountryData();
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await getAllCountryNames();
      if (countries && countries.length) {
        const formatted = countries.map((country) => ({
          label: country.name,
          value: country.code,
        }));
        setAllCountries(formatted);
      }
      setIsCountriesLoading(false);
    };

    fetchCountries();
  }, []);

  return (
    <Autocomplete
      disablePortal
      options={allCountries}
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
        if (newValue) onChange(newValue.value);
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
          sx={{
            backgroundColor: theme === "light" ? "#fffbeb" : "#1d1d20",
            transition: "all 0.6s ease",
            "& .MuiOutlinedInput-root": {
              color: theme === "light" ? "#212121" : "#f3f2ef",
              "& fieldset": {
                borderColor: "#ccc3c3",
                borderWidth: 2,
              },
              "&:hover fieldset": {
                borderColor: "#d1d5db",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#d1d5db",
              },
            },
            "& .MuiInputLabel-root": {
              color: theme === "light" ? "#616161" : "#eee",
              "&.Mui-focused": {
                color: theme === "light" ? "#616161" : "#eee",
              },
            },
            "& .MuiAutocomplete-popupIndicator": {
              color: theme === "light" ? "#212121" : "#f3f2ef",
            },
          }}
        />
      )}
      sx={{ width: "70%" }}
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

export default Searchbar;
