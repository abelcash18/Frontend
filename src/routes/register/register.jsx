import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import Loading from "../../components/Loading/Loading";
import apiRequest from "../../lib/apiRequest";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: true } }));
    setError("");
    
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("auth/register", { username, email, password });
      console.log(res?.data ?? res);
      
      if (res.status === 201) {
         <div style={{backgroundColor:"whitesmoke", padding: "10px", border: "1px solid grey", borderRadius:"5px"}}>
        alert(`Registration successful Please log in.`);
        </div>
        navigate("/login");
      }
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
      window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
    }
  };

  return (
    <div className="register">
      <div className="formContainer">
        <div className="formWrapper">
          <div className="formHeader">
            <h1>Join Dewgates Consults</h1>
            <p>Create your account and start your journey</p>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="inputGroup">
              <label htmlFor="username">Username</label>
              <input 
                id="username"
                name="username" 
                required 
                type="text" 
                placeholder="Choose a username" 
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                name="email" 
                type="email" 
                required 
                placeholder="Enter your email" 
              />
            </div>

            <div className="inputGroup">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                name="password" 
                type="password" 
                required 
                placeholder="Create a password" 
              />
              <small className="passwordHint">
                Use 8+ characters with a mix of letters, numbers & symbols
              </small>
            </div>

            <button type="submit" disabled={isLoading} className="submitBtn">
              {isLoading ? (
                <span className="loading-in-button">
                  <Loading size={20} />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>

            {error && <div className="errorMessage">{error}</div>}

            <div className="formFooter">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="link">Sign in here</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      <div className="imgContainer">
        <div className="imageContent">
          <img 
            src="/bg1.jpeg" 
            alt="Luxury apartment building" 
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
            }}
          />
          <div className="imageOverlay">
            <h2>Start Your Journey</h2>
            <p>Discover your perfect home with our premium real estate services</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;