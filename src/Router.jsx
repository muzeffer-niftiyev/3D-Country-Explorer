import App from "./App";
import FlagQuiz from "./components/FlagQuiz";
import LikedCountries from "./components/LikedCountries";
import { Navigate, Route, Routes } from "react-router-dom";
import ExploreCountries from "./components/ExploreCountries";

const Router = () => {
  return (
    <Routes>
      <Route element={<App />}>
        <Route index element={<Navigate replace to="country-details" />} />
        <Route path="country-details" element={<ExploreCountries />} />
        <Route path="country/:slug" element={<ExploreCountries />} />
        <Route path="liked" element={<LikedCountries />} />
        <Route path="quiz" element={<FlagQuiz />} />
        <Route path="*" element={<Navigate replace to="/country-details" />} />
      </Route>
    </Routes>
  );
};

export default Router;
