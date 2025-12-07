import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Layout() {
  const location = useLocation();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));

    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Navbar />
        <Outlet />
          </div>
              )}

function RequireAuth() {
  const { currentUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));

    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return !currentUser ? (
    <Navigate to="/login" />
  ) : (
    <div className="layout">
      <Navbar />
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export { Layout, RequireAuth };