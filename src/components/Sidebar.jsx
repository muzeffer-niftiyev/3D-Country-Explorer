import { Select } from "antd";
import {
  getAllCountryNames,
  getCountryDataFromCode,
} from "../services/services";
import { useEffect, useState } from "react";
import DataCard from "./DataCard";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { setSelectedCountryData } from "../store/countrySlice";

const Sidebar = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const isDataLoading = useSelector((state) => state.country.isLoading);
  const selectedCountry = useSelector(
    (state) => state.country.selectedCountryData
  );

  const onChange = (value) => {
    const getCountryData = async () => {
      const data = await getCountryDataFromCode(value);
      console.log(data);
      dispatch(setSelectedCountryData(data));
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
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    console.log(selectedCountry);
  }, [selectedCountry]);

  return (
    <div className="bg-white h-full p-6 flex items-center flex-col">
      <h1 className="font-medium text-xl mb-8">
        Welcome to the <span className="font-bold">Countries Explorer</span>!
        Choose a country to explore by clicking on the 3D Earth or selecting
        from the dropdown list.
      </h1>

      <Select
        className="w-[70%]"
        showSearch
        loading={isLoading}
        placeholder="Select a country"
        onChange={onChange}
        options={allCountries}
        value={selectedCountry?.name || null}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
      {isDataLoading ? <Loader /> : <DataCard />}
    </div>
  );
};

export default Sidebar;
