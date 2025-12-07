import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import AlertModal from "../../components/AlertModal/AlertModal";

function Layout() {
  const location = useLocation();
  const [logoutMessage, setLogoutMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("globalLoading", { detail: { loading: true } }));

    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent("globalLoading", { detail: { loading: false } }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [location.pathname]);

    useEffect(() => {
    try {
      const raw = localStorage.getItem("logoutMessage");
      if (raw) {
        const data = JSON.parse(raw);
        if (data?.message) {
          setLogoutMessage(data.message);
          setShowLogoutModal(true);
          localStorage.removeItem("logoutMessage");
        }
      }
    } catch (e) {
      console.error("Failed to read logoutMessage from localStorage:", e);
    }
  }, [location.pathname]);

  return (
    <div className="layout">
      <Navbar />
      {showLogoutModal && (
        <AlertModal message={logoutMessage} isOpen={showLogoutModal} type="success" onClose={() => setShowLogoutModal(false)} />
      )}
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

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