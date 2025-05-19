export const selectStyle = (theme) => {
  return {
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
    "& .MuiAutocomplete-noOptions": {
      backgroundColor: theme === "light" ? "#fffbeb" : "#1d1d20",
      color: theme === "light" ? "#212121" : "#f3f2ef",
      padding: "10px 16px",
    },
  };
};

export const filterStyle = (theme) => {
  return {
    backgroundColor: theme === "light" ? "#fffbeb" : "#1d1d20",
    transition: "all 0.6s ease",
    color: theme === "light" ? "#212121" : "#f3f2ef",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc3c3",
      borderWidth: 2,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d1d5db",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d1d5db",
    },
    "& .MuiSelect-icon": {
      color: theme === "light" ? "#212121" : "#f3f2ef",
    },

    "& .MuiAutocomplete-popupIndicator": {
      color: theme === "light" ? "#212121" : "#f3f2ef",
    },
    "& .MuiAutocomplete-noOptions": {
      backgroundColor: theme === "light" ? "#fffbeb" : "#1d1d20",
      color: theme === "light" ? "#212121" : "#f3f2ef",
      padding: "10px 16px",
    },
  };
};
