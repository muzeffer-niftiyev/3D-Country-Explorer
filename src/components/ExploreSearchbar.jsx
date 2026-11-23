import { useSelector } from "react-redux";
import { selectStyle } from "../utils/miuStyle";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useSelectCountry } from "../hooks/useCountrySelection";

const ExploreSearchbar = ({ countries, isLoading }) => {
  const selectCountry = useSelectCountry();
  const theme = useSelector((state) => state.theme.theme);
  const selectedCountry = useSelector(
    (state) => state.country.selectedCountryData
  );

  return (
    <Autocomplete
      disablePortal
      className="flex-1 min-w-0"
      options={countries}
      loading={isLoading}
      getOptionLabel={(option) => option.name}
      groupBy={(option) => option.name[0].toUpperCase()}
      isOptionEqualToValue={(option, value) => option.code === value.code}
      value={
        selectedCountry?.name && selectedCountry?.code
          ? { name: selectedCountry.name, code: selectedCountry.code }
          : null
      }
      onChange={(_, newValue) => {
        if (newValue) selectCountry(newValue.code);
      }}
      filterOptions={(options, { inputValue }) =>
        options.filter((option) =>
          option.name.toLowerCase().includes(inputValue.toLowerCase())
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
