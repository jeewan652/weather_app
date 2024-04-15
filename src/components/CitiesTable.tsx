import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import './citiesTable.css';

import logo from "./logo.png";

import github from "./github.png";

interface CityRecord {
  recordid: string;
  fields: {
    name: string;
    cou_name_en: string;
    population:number;
    timezone: string;
    coordinates: string;
   

  };
}

const CitiesTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<CityRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastSearchedCity, setLastSearchedCity] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [sortBy, setSortBy] = useState<string>("name"); // State for sorting column
  const [sortOrder, setSortOrder] = useState<string>("asc"); // State for sorting order
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const observer = useRef<any>();

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&q=${searchQuery}&rows=10&page=${pageNumber}`
        );
        const newCities = response.data.records.map((record: any) => ({
          recordid: record.recordid,
          fields: record.fields
        }));
        setSearchResults((prevCities) => [...prevCities, ...newCities]);
        if (response.data.records.length > 0) {
          const lastSearched = response.data.records[response.data.records.length - 1].fields.name;
          setLastSearchedCity(lastSearched);
          setSearchHistory((prevHistory) => [...prevHistory, lastSearched]); // Update search history
        }
        setHasMore(response.data.records.length > 0);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCities();
  }, [searchQuery, pageNumber]);
  
  const handleObserver = (entities: any) => {
    const target = entities[0];
    if (target.isIntersecting && hasMore) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    observer.current = new IntersectionObserver(handleObserver, options);

    if (observer.current) {
      observer.current.observe(document.querySelector(".observerElement") as HTMLElement);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasMore]);

  const handleSearch = () => {
    setSearchResults([]);
    setPageNumber(1);
    setSearchQuery(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);

    // Filter suggestions based on the input value
    const filteredSuggestions = searchResults
      .filter(result => result.fields.name.toLowerCase().includes(e.target.value.toLowerCase()))
      .map(result => result.fields.name);

    setSuggestions(filteredSuggestions);
  };

  const handleCityClick = (cityName: string) => {
    // Navigate to the weather page for the city
    window.open(`/weather/${cityName}`, '_blank');
    setSearchQuery("");
  };

  const handleRightClick = (e: React.MouseEvent<HTMLTableRowElement>, cityName: string) => {
    // Open the weather page for the city in a new tab on right click
    e.preventDefault();
    window.open(`/weather/${cityName}`, '_blank');
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if clicking on the same column
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Sort by the new column and set order to ascending
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Sort searchResults based on sorting criteria
  const sortedResults = [...searchResults].sort((a, b) => {
    if (sortBy === "name") {
      return sortOrder === "asc" ? a.fields.name.localeCompare(b.fields.name) : b.fields.name.localeCompare(a.fields.name);
    } else if (sortBy === "timezone") {
      return sortOrder === "asc" ? a.fields.timezone.localeCompare(b.fields.timezone) : b.fields.timezone.localeCompare(a.fields.timezone);
    }
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto relative">

      <div className="container relative bottom-0 mb-4 mr-4 border flex justify-between mt-5 cursor-pointer">
        <div className="flex">
          <img src={logo} className="social" alt="logo" style={{ width: "50px", height: "50px" }} />
          <span className="ml-3 mt-4 text-white font-bold text-lg">WEATHER APP</span>
        </div>

        <a href="https://github.com/jeewan652" target="_blank" rel="noreferrer" className="text-black hover:text-gray-700 flex items-center ">
          <img src={github} className="social" alt="GitHub" style={{ width: "40px", height: "40px" }} />
          <span className="ml-3 text-white  font-bold text-lg">Jeewan Kundu</span>
        </a>
      </div>
      <h1 className="text-3xl font-bold text-center mb-8 mt-5 underline">Cities Table</h1>
      {/* Search bar with suggestions */}
      <div className="relative flex justify-center items-center mb-4 space-x-2 search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Search cities..."
          className="px-48 py-2 border border-gray-300 rounded mr-2"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
        <ul className="suggestions bg-white border border-gray-300 divide-y divide-gray-300 rounded-b-md mt-1">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="px-4 py-3 hover:bg-gray-100 cursor-pointer" onClick={() => handleCityClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      </div>

      {/* Display last searched city */}
      {lastSearchedCity && (
        <div className="text-center my-10">
          Last Searched City: <strong>{lastSearchedCity}</strong>
        </div>
      )}
      {/* Display search history */}
      <div className="text-center my-4">
        <strong>Search History:</strong>
        <ul>
          {searchHistory.map((city, index) => (
            <li key={index}>{city}</li>
          ))}
        </ul>
      </div>
      {/* Display search results */}
      <table className="w-full divide-y divide-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2" onClick={() => handleSort("name")}>
              City {sortBy === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="border border-gray-300 p-2">CountryName</th>
            <th className="border border-gray-300 p-2">Population</th>
            <th className="border border-gray-300 p-2" onClick={() => handleSort("timezone")}>
              Timezone {sortBy === "timezone" && (sortOrder === "asc" ? "▲" : "▼")}
            </th>
            <th className="border border-gray-300 p-2">Coordinates</th>
          </tr>
        </thead>
        <tbody>
          {sortedResults.map((city, index) => (
            <tr key={index} className="cursor-pointer hover:bg-gray-100" onClick={() => handleCityClick(city.fields.name)} onContextMenu={(e) => handleRightClick(e, city.fields.name)}>
              <td className="border border-gray-300 p-2">{city.fields.name}</td>
              <td className="border border-gray-300 p-2">{city.fields.cou_name_en}</td>
              <td className="border border-gray-300 p-2">{city.fields.population}</td>
              <td className="border border-gray-300 p-2">{city.fields.timezone}</td>
              <td className="border border-gray-300 p-2">{city.fields.coordinates}</td>

            </tr>
          ))}
        </tbody>
      </table>
      {/* Observer element for infinite scroll */}
      <div className="py-4 px-4 observerElement"></div>

      {/* Display loading spinner */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitiesTable;
