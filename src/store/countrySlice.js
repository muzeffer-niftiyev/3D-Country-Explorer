import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCountryData: {},
  isLoading: false,
  isCountryChanged: false,
  flyCoordinates: [],
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountryData: (state, action) => {
      state.selectedCountryData = action.payload;
    },

    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    toggleIsCountryChanged: (state) => {
      state.isCountryChanged = !state.isCountryChanged;
    },

    setFlyCoordinates: (state, action) => {
      state.flyCoordinates = action.payload;
    },
  },
});

export const {
  setIsLoading,
  setFlyCoordinates,
  setSelectedCountryData,
  toggleIsCountryChanged,
} = countrySlice.actions;
export default countrySlice.reducer;
