import { useContext, useState } from "react";
import "./navbar.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const [open, setOpen] = useState(false);

    const {currentUser} =  useContext(AuthContext);  
  return (
    <nav>
      <div className="left">
        <a href="/" className="logo">
          <img style={{ width: "170px", height: "50px" }} src="/logo 2.jpg" alt="" />
          <span></span>
        </a>
  <a href="/">Home</a>
  <Link to="/about">About</Link>
        <a href="/contact">Contact</a>
        <a href="/">Agents</a>
      </div>
      <div className="right">
        {currentUser ? (
          <div className="user">
            <img
              src={currentUser.avatar || "/noavatarr.jpg"}
              alt="Profile picture"
            />
            <span>{currentUser.username || "Dewgates Consults"}</span>
            <Link to="/profile" className="profile">
              <div className="notification">3</div>
              <span>Profile</span>
            </Link>
          </div>
        ) : (
          <>
            <a href="/login" className="sign in" >Sign in</a>
            <a href="/register" className="register">
              Sign up
            </a>
          </>
        )}
        <div className="menuIcon">
          <img
            src="/menu.png"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
        </div>
        <div className={open ? "menu active" : "menu"}>
          <a href="/">Home</a>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/">Agents</Link>
          <Link to="/login" className="sign in">Login</Link>
          <Link to="/register" className="register">Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
