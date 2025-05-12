import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCountryData: {},
  isLoading: false,
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
  },
});

export const { setSelectedCountryData, setIsLoading } = countrySlice.actions;
export default countrySlice.reducer;
