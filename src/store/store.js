import { configureStore } from "@reduxjs/toolkit";
import countrySlice from "./countrySlice";
import themeSlice from "./themeSlice";

export default configureStore({
  reducer: {
    country: countrySlice,
    theme: themeSlice,
  },
});
