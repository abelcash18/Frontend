import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import Loading from "../../components/Loading/Loading";
import apiRequest from "../../lib/apiRequest";

function ListPage() {
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    type: "",
    property: "",
    minPrice: "",
    maxPrice: "",
    bedroom: ""
  });

  useEffect(() => {
    const selectedPropertyType = sessionStorage.getItem('selectedPropertyType');
    if (selectedPropertyType) {
      setFilters(prev => ({
        ...prev,
        property: selectedPropertyType
      }));
       sessionStorage.removeItem('selectedPropertyType');
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await apiRequest.get("/posts");
        setPosts(response.data);
        
         let results = response.data;
        if (filters.property) {
          results = results.filter(post => post.propertyType === filters.property);
        }
        
        setFilteredPosts(results);
        console.log("Posts fetched successfully:", response.data.length);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

   useEffect(() => {
    let results = [...posts];

     if (filters.city) {
      results = results.filter(post => 
        post.city?.toLowerCase().includes(filters.city.toLowerCase()) ||
        post.address?.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

     if (filters.type) {
      results = results.filter(post => post.type === filters.type);
    }

     if (filters.property) {
      results = results.filter(post => post.propertyType === filters.property);
    }

     if (filters.minPrice) {
      results = results.filter(post => post.price >= parseInt(filters.minPrice));
    }
    if (filters.maxPrice) {
      results = results.filter(post => post.price <= parseInt(filters.maxPrice));
    }

     if (filters.bedroom) {
      results = results.filter(post => post.bedroom >= parseInt(filters.bedroom));
    }

    setFilteredPosts(results);
  }, [filters, posts]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      city: "",
      type: "",
      property: "",
      minPrice: "",
      maxPrice: "",
      bedroom: ""
    });
  };

  const getPropertyTypeDisplayName = (propertyType) => {
    const propertyTypeMap = {
      'apartment': 'Apartments',
      'house': 'Houses',
      'condo': 'Condos',
      'land': 'Land',
      'commercial': 'Commercial'
    };
    return propertyTypeMap[propertyType] || propertyType;
  };

  if (error) {
    return (
      <div className="listPage">
        <div className="errorContainer">
          <div className="errorContent">
            <img src="/error.png" alt="Error" />
            <h2>Unable to Load Properties</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retryBtn">
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter 
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            resultCount={filteredPosts.length}
            totalCount={posts.length}
          />
          
       {filters.property && (
            <div className="propertyTypeHeader">
              <h2>
                {getPropertyTypeDisplayName(filters.property)} 
                <span className="propertyCount"> ({filteredPosts.length} properties)</span>
              </h2>
              <p>Browse our selection of {getPropertyTypeDisplayName(filters.property).toLowerCase()}</p>
              <button 
                onClick={handleClearFilters}
                className="clearPropertyFilter"
              >
                Show All Property Types
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="loadingSection">
              <Loading size="large" text="Loading properties..." />
            </div>
          ) : (
            <>
              {filteredPosts.length > 0 ? (
                <div className="resultsSection">
                  <div className="resultsGrid">
                    {filteredPosts.map(item => (
                      <Card key={item._id || item.id} item={item} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="noResults">
                  <img src="/error.png" alt="No results" />
                  <h3>
                    {filters.property 
                      ? `No ${getPropertyTypeDisplayName(filters.property).toLowerCase()} found`
                      : "No properties found"
                    }
                  </h3>
                  <p>Try adjusting your filters or search criteria</p>
                  <button onClick={handleClearFilters} className="clearFiltersBtn">
                    Clear all filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="mapContainer">
        {!isLoading && (
          <Map items={filteredPosts} />
        )}
      </div>
    </div>
  );
}

export default ListPage;