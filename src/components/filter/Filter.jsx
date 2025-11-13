import { useState, useEffect } from "react";
import "./filter.scss";

function Filter({ filters, onFilterChange, onClearFilters, resultCount, totalCount }) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (field, value) => {
    const newFilters = {
      ...localFilters,
      [field]: value
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== "");

  return (
    <div className="filter">
      <div className="filterHeader">
        <div className="titleSection">
          <h1>Discover Your Perfect Property</h1>
          <p className="resultsCount">
            Showing {resultCount} of {totalCount} properties
          </p>
        </div>
        {hasActiveFilters && (
          <button className="clearAllBtn" onClick={onClearFilters}>
            Clear All
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className="filterForm">
        <div className="topSection">
          <div className="searchItem">
            <label htmlFor="city">Location</label>
            <div className="searchInput">
              <img src="/search.png" alt="Search" className="searchIcon" />
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Search by city or address..."
                value={localFilters.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bottomSection">
          <div className="filterGroup">
            <div className="filterItem">
              <label htmlFor="type">Type</label>
              <select 
                name="type" 
                id="type"
                value={localFilters.type}
                onChange={(e) => handleInputChange("type", e.target.value)}
              >
                <option value="">Any Type</option>
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </div>

            <div className="filterItem">
              <label htmlFor="property">Property Type</label>
              <select 
                name="property" 
                id="property"
                value={localFilters.property}
                onChange={(e) => handleInputChange("property", e.target.value)}
              >
                <option value="">Any Property</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>

            <div className="filterItem">
              <label htmlFor="minPrice">Min Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="No min"
                value={localFilters.minPrice}
                onChange={(e) => handleInputChange("minPrice", e.target.value)}
                min="0"
              />
            </div>

            <div className="filterItem">
              <label htmlFor="maxPrice">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="No max"
                value={localFilters.maxPrice}
                onChange={(e) => handleInputChange("maxPrice", e.target.value)}
                min="0"
              />
            </div>

            <div className="filterItem">
              <label htmlFor="bedroom">Bedrooms</label>
              <select 
                name="bedroom" 
                id="bedroom"
                value={localFilters.bedroom}
                onChange={(e) => handleInputChange("bedroom", e.target.value)}
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <button type="submit" className="searchBtn">
              <img src="/search.png" alt="Search" />
              <span>Search</span>
            </button>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="activeFilters">
            <span>Active filters:</span>
            {Object.entries(localFilters).map(([key, value]) => 
              value && (
                <span key={key} className="filterTag">
                  {key}: {value}
                  <button 
                    type="button"
                    onClick={() => handleInputChange(key, "")}
                  >
                    ×
                  </button>
                </span>
              )
            )}
          </div>
        )}
      </form>
    </div>
  );
}

export default Filter;