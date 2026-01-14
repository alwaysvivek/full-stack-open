import { useState, useEffect } from "react";

import getAllCountries from "./services/countries";
import CountryFilter from "./components/CountryFilter";
import Content from "./components/Content";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [countryData, setCountryData] = useState([]);
  const [visibleCountries, setVisibleCountries] = useState([]);

  useEffect(() => {
    getAllCountries().then((data) => {
      setCountryData(data);
    });
  }, []);

  const onSearchChange = (event) => {
    const term = event.target.value;
    const matches =
      term.trim().length === 0
        ? countryData
        : countryData.filter((c) =>
          c.name.common
            .toLowerCase()
            .includes(term.trim().toLowerCase())
        );
    setSearchTerm(term);
    setVisibleCountries(matches);
  };

  const onShowCountry = (country) => {
    setVisibleCountries([country]);
  };

  return (
    <div>
      <CountryFilter filter={searchTerm} handleFilterChange={onSearchChange} />
      <Content
        countries={visibleCountries}
        filter={searchTerm}
        selectCountry={onShowCountry}
      />
    </div>
  );
};

export default App;
