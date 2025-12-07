import { useContext, useState, useEffect } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleLinkClick = () => {
    setOpen(false);
  };

   useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && !event.target.closest('.menu') && !event.target.closest('.menuIcon')) {
        setOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open]);

  return (
    <nav className={open ? "nav-open" : ""}>
      <div className="left">
        <Link to="/" className="logo">
          <img src="/logo 2.jpg" alt="EstateElite" className="logo-img" />
        </Link>
        <div className="desktop-links">
          <Link to="/" onClick={handleLinkClick}>Home</Link>
          <Link to="/list" onClick={handleLinkClick}>Properties</Link>
          <Link to="/agents" onClick={handleLinkClick}>Agents</Link>
          <Link to="/about" onClick={handleLinkClick}>About</Link>
          <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
        </div>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || "/noavatarr.jpg"}
              alt="Profile"
              className="user-avatar"
            />
            <span className="username">{currentUser.username || "Dewgates Consults"}</span>
            <Link to="/profile" className="profile-link" onClick={handleLinkClick}>
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="sign-in-link">Sign In</Link>
            <Link to="/register" className="register-link">Sign Up</Link>
          </div>
        )}
        <div className="menuIcon">
          <button 
            className={`hamburger ${open ? "hamburger--active" : ""}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className={`menu ${open ? "menu--active" : ""}`}>
          <div className="menu-header">
            <h3>Menu</h3>
            <button 
              className="close-menu"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
            >
              ✕
            </button>
          </div>
          <div className="menu-links">
            <Link to="/" onClick={handleLinkClick}>Home</Link>
            <Link to="/list" onClick={handleLinkClick}>Properties</Link>
            <Link to="/agents" onClick={handleLinkClick}>Agents</Link>
            <Link to="/about" onClick={handleLinkClick}>About</Link>
            <Link to="/contact" onClick={handleLinkClick}>Contact</Link>
            {!currentUser && (
              <>
                <Link to="/login" onClick={handleLinkClick} className="sign-in-mobile">Sign In</Link>
                <Link to="/register" onClick={handleLinkClick} className="register-mobile">Sign Up</Link>
              </>
            )}
            {currentUser && (
              <Link to="/profile" onClick={handleLinkClick} className="profile-mobile">
                <img src={currentUser.avatar || "/noavatarr.jpg"} alt="Profile" />
                <span>Profile</span>
              </Link>
            )}
          </div>
        </div>
       {open && <div className="menu-overlay" onClick={() => setOpen(false)}></div>}
      </div>
    </nav>
  );
}

export default Navbar;