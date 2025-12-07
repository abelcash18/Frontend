import { Link } from "react-router-dom";
import "./footer.scss";
import "bootstrap/dist/css/bootstrap.min.css";
function Footer() {
  // Property type links now use URL query params (no sessionStorage)

  return (
    <footer className="footer">
      <div className="container">
        <div className="footerContent">
          <div className="footerSection">
            <div className="logo">
              <Link to="/"><img src="/logo 2.jpg" alt="Dewgates Consults" /></Link>
            </div>
            <p className="footerDescription">
              Your trusted partner in finding the perfect property. 
              We connect you with your dream home through innovative 
              technology and personalized service.
            </p>
            <div className="d-flex gap-3" >
              <a href="https://facebook.com/Joseph Abel Damilare" className="text-primary fs-3">
              <i className="bi bi-facebook"></i>
              </a>
              <a href="https://twitter.com/JosephAlfredca2" className="text-info fs-3">
                 <i className="bi bi-twitter"></i>
              </a>
              <a href="https://instagram.com/abelcash.18" className="text-danger fs-3">
                 <i className="bi bi-instagram"></i>
              </a>
              <a href="https://linkedin.com/Joseph Abel" className="text-primary fs-3">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="+2349056424816" className="text-success fs-3">
                <i className="bi bi-whatsapp"></i>
              </a>
              <a href="https://github.com/abelcash18" className="text-lightdark fs-3">
                <i className="bi bi-github"></i>
              </a>
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
                <Link to="/list?property=apartment">Apartments</Link>
              </li>
              <li>
                <Link to="/list?property=house">Houses</Link>
              </li>
              <li>
                <Link to="/list?property=condo">Condos</Link>
              </li>
              <li>
                <Link to="/list?property=land">Land</Link>
              </li>
              <li>
                <Link to="/list?property=commercial">Commercial</Link>
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