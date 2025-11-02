import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
//import Footer from "../../components/footer/Footer.jsx";

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";

function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Dispatch global loading event on route change
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));

    // Simulate loading time or wait for actual loading
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }, 1000); // Adjust timeout as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="layout">
      <div className="navbar">
        <Navbar />
      </div>
      <div className="content">
        <Outlet />
      </div>
      </div>
  );
}

 function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    // Dispatch global loading event on route change
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));

    // Simulate loading time or wait for actual loading
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }, 1000); // Adjust timeout as needed

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    !currentUser ? <Navigate to ="login"/>
    : (
      <div className="layout">
        <div className="navbar">
          <Navbar />
        </div>
        <div className="content">
          <Outlet />
        </div>
        </div>
    )
  );
}
export { Layout, RequireAuth  };