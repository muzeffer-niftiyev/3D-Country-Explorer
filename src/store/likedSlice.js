import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likedCountries: JSON.parse(localStorage.getItem("liked")) || [],
};

const likedSlice = createSlice({
  name: "liked",
  initialState,
  reducers: {
    addToLiked: (state, action) => {
      const isLiked = state.likedCountries.find(
        (country) => country.code === action.payload.code
      );
      if (isLiked) return;

      state.likedCountries.push(action.payload);
      localStorage.setItem("liked", JSON.stringify(state.likedCountries));
    },
    removeFromLiked: (state, action) => {
      state.likedCountries = state.likedCountries.filter(
        (country) => country.code !== action.payload
      );
      localStorage.setItem("liked", JSON.stringify(state.likedCountries));
    },
  },
});

export const { addToLiked, removeFromLiked } = likedSlice.actions;
export default likedSlice.reducer;
