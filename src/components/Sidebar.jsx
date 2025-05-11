import { Select } from "antd";
import { getAllCountryNames } from "../services/services";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      const countries = await getAllCountryNames();
      if (countries && countries.length) {
        const formatted = countries.map((name) => ({
          label: name,
          value: name,
        }));
        setAllCountries(formatted);
      }
      setIsLoading(false);
    };

    fetchCountries();
  }, []);

  return (
    <div className="bg-white h-full p-6 flex items-center flex-col">
      <h1 className="font-medium text-xl mb-8">
        Welcome to the <span className="font-bold">Countries Explorer</span>!
        Choose a country to explore by clicking on the 3D Earth or selecting
        from the dropdown list.
      </h1>

      <Select
        className="w-[80%]"
        showSearch
        loading={isLoading}
        placeholder="Select a country"
        onChange={onChange}
        options={allCountries}
        filterOption={(input, option) =>
          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
        }
      />
    </div>
  );
};

export default Sidebar;
