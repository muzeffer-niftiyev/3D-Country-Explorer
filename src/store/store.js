import { configureStore } from "@reduxjs/toolkit";
import countrySlice from "./countrySlice";
import themeSlice from "./themeSlice";
import likedSlice from "./likedSlice";

export default configureStore({
  reducer: {
    country: countrySlice,
    theme: themeSlice,
    liked: likedSlice,
  },
});
