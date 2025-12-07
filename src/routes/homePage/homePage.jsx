import { useContext } from "react";
import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  
  return (
   <div className="homePage">
   <section className="heroSection">
        <div className="container">
          <div className="heroContent">
            <div className="textContainer">
              <div className="content">
                <div className="badge">Trusted by 10,000+ Clients</div>
                <h1 className="title">
                  Find Your Perfect <span className="highlight">Dream Home, Land and Properties</span>
                </h1>
                <p className="description">
                  Discover the perfect property from our curated collection of apartments, 
                  villas, modern residences, Land And Properties. Your Dream home, land is just a search away.
                </p>
                <SearchBar />
                
                <div className="stats">
                  <div className="statItem">
                    <h3>10K+</h3>
                    <p>Properties</p>
                  </div>
                  <div className="statItem">
                    <h3>2K+</h3>
                    <p>Happy Clients</p>
                  </div>
                  <div className="statItem">
                    <h3>50+</h3>
                    <p>Cities</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="imgContainer">
              <div className="imageWrapper">
                <img 
                  src="/modern-home.jpg" 
                  alt="Modern Luxury Home" 
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80';
                  }}
                />
                <div className="floatingCard">
                  <div className="cardContent">
                    <div className="rating">★ 4.9/5</div>
                    <p>`Found my dream apartment in just 2 days!`</p>
                    <span>- Sarah Johnson</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

     <section className="featuresSection">
        <div className="container">
          <div className="sectionHeader">
            <h2>Why Choose Dewgates Consults</h2>
            <p>We provide the best real estate experience with cutting-edge technology</p>
          </div>
          <div className="featuresGrid">
            <div className="featureCard">
              <div className="iconWrapper">
                <span className="icon">🏠</span>
              </div>
              <h3>Wide Selection</h3>
              <p>Thousands of verified properties across multiple cities with detailed information and virtual tours.</p>
            </div>
            <div className="featureCard">
              <div className="iconWrapper">
                <span className="icon">💰</span>
              </div>
              <h3>Best Prices</h3>
              <p>Competitive pricing with no hidden charges. We ensure you get the best value for your investment.</p>
            </div>
            <div className="featureCard">
              <div className="iconWrapper">
                <span className="icon">🛡️</span>
              </div>
              <h3>Verified Listings</h3>
              <p>All properties are thoroughly verified, authenticated, and regularly updated for accuracy.</p>
            </div>
            <div className="featureCard">
              <div className="iconWrapper">
                <span className="icon">📞</span>
              </div>
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support team ready to assist you with all your real estate needs.</p>
            </div>
          </div>
        </div>
      </section>

    <section className="propertyTypes">
        <div className="container">
          <div className="sectionHeader">
            <h2>Explore Property Types</h2>
            <p>Find the perfect property that matches your lifestyle and needs</p>
          </div>
          <div className="propertyGrid">
            <div className="propertyCard">
              <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Apartments" />
              <div className="propertyInfo">
                <h4>Apartments</h4>
                <p>500+ Listings</p>
              </div>
            </div>
            <div className="propertyCard">
              <img src="https://images.unsplash.com/photo-1513584684374-8bab748fbf90?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Villas" />
              <div className="propertyInfo">
                <h4>Villas</h4>
                <p>300+ Listings</p>
              </div>
            </div>
            <div className="propertyCard">
              <img src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" alt="Townhouses" />
              <div className="propertyInfo">
                <h4>Townhouses</h4>
                <p>200+ Listings</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="ctaSection">
        <div className="container">
          <div className="ctaContent">
            <h2>Ready to Find Your Dream Home?</h2>
            <p>Join thousands of satisfied customers who found their perfect match with our expert guidance</p>
            <div className="ctaButtons">
              <button onClick={() => navigate('/list')} className="btn-primary">Browse Properties</button>
              <button  onClick={() => navigate('/about')} className="btn-secondary">Contact Agent</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;