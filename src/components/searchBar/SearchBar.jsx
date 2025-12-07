import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./searchBar.scss";

const types = ["buy", "rent"];

function SearchBar() {
  const [query, setQuery] = useState({
    type: "buy",
    location: "",
    minPrice: "",
    maxPrice: "",
    propertyType: "any"
  });

  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", query);
  };

  // When user submits search, pass filters to ListPage via sessionStorage and navigate
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.location) params.set("city", query.location);
    if (query.type) params.set("type", query.type);
    if (query.propertyType && query.propertyType !== "any") params.set("property", query.propertyType);
    if (query.minPrice !== "") params.set("minPrice", String(query.minPrice));
    if (query.maxPrice !== "") params.set("maxPrice", String(query.maxPrice));
    // navigate to /list with query params
    const search = params.toString();
    navigate({ pathname: "/list", search: search ? `?${search}` : "" });
  };

  const propertyTypes = ["Any", "Apartment", "Villa", "Townhouse", "Condominium", "Commercial"];
  return (
    <div className="searchBar">
      <div className="searchHeader">
        <div className="type">
          {types.map((type) => (
            <button
              key={type}
              onClick={() => switchType(type)}
              className={query.type === type ? "active" : ""}
            >
              {type}
              <span className="indicator"></span>
            </button>
          ))}
        </div>
        <button 
          className="expandBtn"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Fewer Options" : "More Options"}
        </button>
      </div>

      <form onSubmit={handleSearch}>
        <div className="formGrid">
          <div className="inputGroup locationGroup">
           <input
              type="text"
              name="location"
              placeholder="Enter city, neighborhood, or ZIP"
              value={query.location}
              onChange={(e) => setQuery(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="inputGroup">           
            <input
              type="number"
              name="minPrice"
              min={0}
              max={1000000}
              placeholder="Min price"
              value={query.minPrice}
              onChange={(e) => setQuery(prev => ({ ...prev, minPrice: e.target.value }))}
            />
          </div>

          <div className="inputGroup">
           <input 
              type="number"
              name="maxPrice"
              min={0}
              max={1000000}
              placeholder="Max price"
              value={query.maxPrice}
              onChange={(e) => setQuery(prev => ({ ...prev, maxPrice: e.target.value }))}
            />
          </div>

          <button type="submit" className="searchBtn">
            <img src="/search.png" alt="Search" />
            <span>Search</span>
          </button>
        </div>

        {isExpanded && (
          <div className="advancedOptions">
            <div className="advancedGrid">
              <div className="inputGroup">
                <label>Property Type</label>
                <select 
                  value={query.propertyType}
                  onChange={(e) => setQuery(prev => ({ ...prev, propertyType: e.target.value }))}
                >
                  {propertyTypes.map(type => (
                    <option key={type} value={type.toLowerCase()}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="inputGroup">
                <label>Bedrooms</label>
                <select>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="inputGroup">
                <label>Bathrooms</label>
                <select>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default SearchBar;