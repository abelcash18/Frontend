import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Loading from "../../components/Loading/Loading";
import { AuthContext } from "../../context/AuthContext";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState("");
  const { updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));
    setError("");
    
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await fetch("http://localhost:8800/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const payload = await res.json();

      if (!res.ok) {
        const message = payload?.message || payload?.error || res.statusText || "Login failed";
        throw new Error(message);
      }

      const newUser = payload?.user || payload;
      updateUser(newUser);
      navigate("/");
    } catch (err) {
      const message = err?.message || "Something went wrong";
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) {
      setForgotPasswordMessage("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setForgotPasswordMessage("");

    try {
      const res = await fetch("http://localhost:8800/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send reset email");
      }

      setForgotPasswordMessage("Password reset instructions have been sent to your email.");
      setForgotPasswordEmail("");
      
      // Auto-close after success
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordMessage("");
      }, 3000);
    } catch (err) {
      setForgotPasswordMessage(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <div className="formWrapper">
          <div className="formHeader">
            <h1>Welcome Back</h1>
            <p>Sign in to your Dewgates Consults account</p>
          </div>
          
          {!showForgotPassword ? (
            <form onSubmit={handleSubmit}>
              <div className="inputGroup">
                <label htmlFor="username">Username</label>
                <input 
                  id="username"
                  name="username" 
                  required 
                  type="text" 
                  placeholder="Enter your username" 
                />
              </div>

              <div className="inputGroup">
                <label htmlFor="password">Password</label>
                <input 
                  id="password"
                  name="password" 
                  type="password" 
                  required 
                  placeholder="Enter your password" 
                />
              </div>

              <button 
                type="button" 
                className="forgotPasswordBtn"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot your password?
              </button>

              <button type="submit" disabled={isLoading} className="submitBtn">
                {isLoading ? (
                  <span className="loading-in-button">
                    <Loading size={20} />
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>

              {error && <div className="errorMessage">{error}</div>}

              <div className="formFooter">
                <p>
                  Do not have an account?{" "}
                  <Link to="/register" className="link">Create one here</Link>
                </p>
              </div>
            </form>
          ) : (
            <div className="forgotPasswordForm">
              <div className="forgotPasswordHeader">
                <button 
                  className="backToLogin"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordMessage("");
                    setForgotPasswordEmail("");
                  }}
                >
                  ← Back to Login
                </button>
                <h2>Reset Your Password</h2>
                <p>Enter your email address and we will send you instructions to reset your password.</p>
              </div>

              <form onSubmit={handleForgotPassword}>
                <div className="inputGroup">
                  <label htmlFor="email">Email Address</label>
                  <input 
                    id="email"
                    name="email" 
                    type="email" 
                    required 
                    placeholder="Enter your email address"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  />
                </div>

                <button type="submit" disabled={isLoading} className="submitBtn">
                  {isLoading ? (
                    <span className="loading-in-button">
                      <Loading size={20} />
                      Sending Instructions...
                    </span>
                  ) : (
                    'Send Reset Instructions'
                  )}
                </button>

                {forgotPasswordMessage && (
                  <div className={`message ${forgotPasswordMessage.includes("sent") ? "successMessage" : "errorMessage"}`}>
                    {forgotPasswordMessage}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
      
      <div className="imgContainer">
        <div className="imageContent">
          <img 
            src="/bg2.jpeg" 
            alt="Modern luxury home interior" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div className="imageOverlay">
            <h2>Find Your Dream Home</h2>
            <p>Join thousands of satisfied customers who found their perfect match</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;