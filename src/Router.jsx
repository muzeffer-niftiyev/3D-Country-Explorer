import { Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import DataCard from "./components/DataCard";
import FavouriteCountries from "./components/FavouriteCountries";
import Sidebar from "./components/Sidebar";
import CountryDetails from "./components/CountryDetails";

const Router = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<Navigate replace to="country-details" />} />
        <Route path="country-details" element={<CountryDetails />} />
        <Route path="liked" element={<FavouriteCountries />} />
      </Route>

      {/* <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
};

export default Router;
