import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFlyCoordinates,
  toggleIsCountryChanged,
} from "../store/countrySlice";

const LikedSearchbar = ({
  likedCountries,
  selectedCountry,
  setSelectedCountry,
}) => {
  const theme = useSelector((state) => state.theme.theme);
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();

  const onChange = (value) => {
    console.log(value);
    const selected = likedCountries.find((c) => c.code === value);
    if (selected) {
      setSelectedCountry(selected);
      dispatch(toggleIsCountryChanged());
      dispatch(
        setFlyCoordinates({
          lat: selected.coordinates[0],
          lng: selected.coordinates[1],
        })
      );
    }
  };

  useEffect(() => {
    if (likedCountries?.length) {
      const formatted = likedCountries.map((country) => ({
        label: country.name,
        value: country.code,
      }));
      setOptions(formatted);
    }
  }, [likedCountries]);

  return (
    <Autocomplete
      disablePortal
      options={options}
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
          label="Select a liked country"
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
            "& .MuiAutocomplete-clearIndicator": {
              color: theme === "light" ? "#212121" : "#f3f2ef",
            },
          }}
        />
      )}
      sx={{ width: "70%" }}
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

export default LikedSearchbar;
