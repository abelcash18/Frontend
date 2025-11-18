import { Link } from "react-router-dom";
import "./footer.scss";

function Footer() {
  const handlePropertyTypeClick = (propertyType) => {
    sessionStorage.setItem('selectedPropertyType', propertyType);
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footerContent">
          <div className="footerSection">
            <div className="logo">
              <img src="/logo 2.jpg" alt="EstateElite" />
              <h3>Dewgates Consults</h3>
            </div>
            <p className="footerDescription">
              Your trusted partner in finding the perfect property. 
              We connect you with your dream home through innovative 
              technology and personalized service.
            </p>
            <div className="socialLinks">
              <a href="#" aria-label="Facebook">📘</a>
              <a href="#" aria-label="Twitter">🐦</a>
              <a href="#" aria-label="Instagram">📷</a>
              <a href="#" aria-label="LinkedIn">💼</a>
            </div>
          </div>

          <div className="footerSection">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/list">Properties</Link></li>
              <li><Link to="/agents">Agents</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footerSection">
            <h4>Property Types</h4>
            <ul>
              <li>
                <Link 
                  to="/list" 
                  onClick={() => handlePropertyTypeClick('apartment')}
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link 
                  to="/list" 
                  onClick={() => handlePropertyTypeClick('house')}
                >
                  Houses
                </Link>
              </li>
              <li>
                <Link 
                  to="/list" 
                  onClick={() => handlePropertyTypeClick('condo')}
                >
                  Condos
                </Link>
              </li>
              <li>
                <Link 
                  to="/list" 
                  onClick={() => handlePropertyTypeClick('land')}
                >
                  Land
                </Link>
              </li>
              <li>
                <Link 
                  to="/list" 
                  onClick={() => handlePropertyTypeClick('commercial')}
                >
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          <div className="footerSection">
            <h4>Contact Info</h4>
            <div className="contactInfo">
              <div className="contactItem">
                <span>📍</span>
                <span>123 Business District, City 10001</span>
              </div>
              <div className="contactItem">
                <span>📞</span>
                <span>+234 9056 4248 16</span>
              </div>
              <div className="contactItem">
                <span>✉️</span>
                <span>info@dwegatesconsults.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footerBottom">
          <div className="footerBottomContent">
            <p>&copy; 2025 Dewgates Consults. All rights reserved.</p>
            <div className="legalLinks">
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;