import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCountryData: {},
  isLoading: false,
  isCountryChanged: false,
  flyCoordinates: [],
  highlightedCode: null,
  allCountries: [],
  isCountryListLoading: true,
};

export const countrySlice = createSlice({
  name: "country",
  initialState,
  reducers: {
    setSelectedCountryData: (state, action) => {
      state.selectedCountryData = action.payload;
      state.highlightedCode = action.payload?.code ?? null;
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

    setHighlightedCode: (state, action) => {
      state.highlightedCode = action.payload;
    },

    setAllCountries: (state, action) => {
      state.allCountries = action.payload;
      state.isCountryListLoading = false;
    },

    setCountryListFailed: (state) => {
      state.isCountryListLoading = false;
    },
  },
});

export const {
  setIsLoading,
  setFlyCoordinates,
  setSelectedCountryData,
  toggleIsCountryChanged,
  setHighlightedCode,
  setAllCountries,
  setCountryListFailed,
} = countrySlice.actions;
export default countrySlice.reducer;
