import {
  setIsLoading,
  setAllCountries,
  setFlyCoordinates,
  setCountryListFailed,
  setSelectedCountryData,
  toggleIsCountryChanged,
} from "../store/countrySlice";
import toast from "react-hot-toast";
import { toSlug } from "../utils/slug";
import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllCountryNames,
  getCountryDataFromCode,
} from "../services/services";

const showFetchError = (error, fallback) => {
  if (!navigator.onLine) {
    toast.error("No internet connection. Please check your network.");
  } else {
    toast.error(error?.message || fallback);
  }
};

export const useLoadCountryList = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getAllCountryNames()
      .then((countries) => dispatch(setAllCountries(countries)))
      .catch((error) => {
        dispatch(setCountryListFailed());
        showFetchError(error, "Failed to load the country list.");
      });
  }, [dispatch]);
};

let latestRequestId = 0;

export const useSelectCountry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useCallback(
    async (code, { fly = true, updateUrl = true, replaceUrl = false } = {}) => {
      const requestId = ++latestRequestId;
      dispatch(setIsLoading(true));
      try {
        const data = await getCountryDataFromCode(code);
        if (requestId !== latestRequestId) return null;

        dispatch(setSelectedCountryData(data));
        if (fly && data.coordinates?.length) {
          dispatch(toggleIsCountryChanged());
          dispatch(
            setFlyCoordinates({
              lat: data.coordinates[0],
              lng: data.coordinates[1],
            })
          );
        }
        if (updateUrl) {
          navigate(`/country/${toSlug(data.name)}`, { replace: replaceUrl });
        }
        return data;
      } catch (error) {
        if (requestId !== latestRequestId) return null;
        dispatch(setSelectedCountryData({}));
        showFetchError(error, "Failed to fetch country data. Please try again.");
        return null;
      } finally {
        if (requestId === latestRequestId) dispatch(setIsLoading(false));
      }
    },
    [dispatch, navigate]
  );
};

export { showFetchError };
