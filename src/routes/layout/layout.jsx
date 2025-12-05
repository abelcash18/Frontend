import "./layout.scss";
import Navbar from "../../components/navbar/Navbar";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { isClaudeHaikuEnabled } from "../../config/aiConfig";

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
      <main className="content">
        {isClaudeHaikuEnabled() && (
          <div className="ai-enabled-banner" style={{padding:'8px',background:'#e6f7ff',border:'1px solid #b3e5ff',borderRadius:6,marginBottom:12}}>
            Claude Haiku 4.5 enabled for this client
          </div>
        )}
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