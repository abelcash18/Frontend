import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import "./resetPassword.scss";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isTokenValid, setIsTokenValid] = useState(null); // null = loading, true = valid, false = invalid
  const [email, setEmail] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      verifyToken(tokenFromUrl);
    } else {
      setIsTokenValid(false);
    }
  }, [searchParams]);

  const verifyToken = async (token) => {
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:8800/auth/verify-reset-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsTokenValid(true);
        setEmail(data.email);
      } else {
        setMessage(data.message || "Invalid or expired reset token");
        setIsTokenValid(false);
      }
    } catch (err) {
      setMessage("Failed to verify reset token. Please try again.");
      setIsTokenValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8800/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage(data.message || "Failed to reset password");
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking token
  if (isTokenValid === null) {
    return (
      <div className="resetPassword">
        <div className="formContainer">
          <div className="formWrapper">
            <div className="loadingState">
              <Loading size="large" text="Verifying reset link..." />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no token or invalid token
  if (!token || !isTokenValid) {
    return (
      <div className="resetPassword">
        <div className="formContainer">
          <div className="formWrapper">
            <div className="errorState">
              <div className="errorIcon">⚠️</div>
              <h2>Invalid Reset Link</h2>
              <p>{message || "This password reset link is invalid or has expired."}</p>
              <p>Please request a new password reset link from the login page.</p>
              <Link to="/login" className="backToLogin">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="resetPassword">
      <div className="formContainer">
        <div className="formWrapper">
          <div className="formHeader">
            <h1>Reset Your Password</h1>
            <p>Create a new password for your account</p>
            {email && <p className="emailNote">Account: <strong>{email}</strong></p>}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password (min. 6 characters)"
                required
                minLength="6"
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="submitBtn">
              {isLoading ? (
                <span className="loading-in-button">
                  <Loading size={20} />
                  Resetting Password...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>

            {message && (
              <div className={`message ${message.includes("successfully") ? "successMessage" : "errorMessage"}`}>
                {message}
              </div>
            )}

            <div className="formFooter">
              <p>
                Remember your password?{" "}
                <Link to="/login" className="link">Back to Login</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;