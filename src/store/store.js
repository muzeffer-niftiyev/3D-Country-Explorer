import { configureStore } from "@reduxjs/toolkit";
import countrySlice from "./countrySlice";
import themeSlice from "./themeSlice";
import likedSlice from "./likedSlice";

export default configureStore({
  reducer: {
    liked: likedSlice,
    theme: themeSlice,
    country: countrySlice,
  },
});
