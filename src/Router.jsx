import { Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import LikedCountries from "./components/LikedCountries";
import ExploreCountries from "./components/ExploreCountries";

const Router = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<Navigate replace to="country-details" />} />
        <Route path="country-details" element={<ExploreCountries />} />
        <Route path="liked" element={<LikedCountries />} />
      </Route>

      {/* <Route path="*" element={<PageNotFound />} /> */}
    </Routes>
  );
};

export default Router;
