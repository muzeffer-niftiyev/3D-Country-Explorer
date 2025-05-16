import { Select } from "antd";
import {
  getAllCountryNames,
  getCountryDataFromCode,
} from "../services/services";
import { useEffect, useState } from "react";
import DataCard from "./DataCard";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { setIsLoading, setSelectedCountryData } from "../store/countrySlice";

const CountryDetails = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [isCountriesLoading, setIsCountriesLoading] = useState(true);
  const dispatch = useDispatch();
  const isDataLoading = useSelector((state) => state.country.isLoading);
  const selectedCountry = useSelector(
    (state) => state.country.selectedCountryData
  );
  const countryData = useSelector((state) => state.country.selectedCountryData);

  const onChange = (value) => {
    const getCountryData = async () => {
      try {
        dispatch(setIsLoading(true));
        const data = await getCountryDataFromCode(value);
        if (data) {
          dispatch(setSelectedCountryData(data));
        } else {
          console.log("Error setting country code");
        }
      } catch (error) {
        console.error(error);
      } finally {
        dispatch(setIsLoading(false));
      }
    };
    getCountryData();
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await getAllCountryNames();
      if (countries && countries.length) {
        const formatted = countries.map((country) => ({
          label: country.name,
          value: country.code,
        }));
        setAllCountries(formatted);
      }
      setIsCountriesLoading(false);
    };

    fetchCountries();
  }, []);

  return (
    <>
      <h1 className="font-medium text-xl mb-8 text-[#222] dark:text-[#eee]">
        Welcome to the <span className="font-bold">Countries Explorer</span>!
        Choose a country to explore by clicking on the 3D Earth or selecting
        from the dropdown list.
      </h1>

      <Select
        className="w-[70%] dropdown"
        rootClassName="text-2xl"
        showSearch
        loading={isCountriesLoading}
        placeholder="Select a country"
        onChange={onChange}
        options={allCountries}
        value={selectedCountry?.name || null}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
      {isDataLoading ? <Loader /> : <DataCard countryData={countryData} />}
    </>
  );
};

export default CountryDetails;
