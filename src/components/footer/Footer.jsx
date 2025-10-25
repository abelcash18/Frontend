import "./footer.scss";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div className="footer-col about">
          <h4>About</h4>
          <p>
            Small description about your real estate app. Find properties, agents,
            and local market insights.
          </p>
        </div>

        <div className="footer-col links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/listings">Listings</Link></li>
            <li><Link to="/agents">Agents</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        <div className="footer-col contact">
          <h4>Contact</h4>
          <address>
            <div>Phone: <a href="tel:+1234567890">+1 234 567 890</a></div>
            <div>Email: <a href="mailto:info@example.com">info@example.com</a></div>
            <div>Office: Benin City Edo-State NG</div>
          </address>
        </div>

        <div className="footer-col social">
          <h4>Follow Us</h4>
          <ul className="social-list">
            <li><a href="#" aria-label="Facebook">Facebook</a></li>
            <li><a href="#" aria-label="Twitter">Twitter</a></li>
            <li><a href="#" aria-label="Instagram">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {new Date().getFullYear()} Dewgates Consults. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;
