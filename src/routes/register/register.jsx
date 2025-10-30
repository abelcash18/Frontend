import apiRequest from "../../lib/apiRequest";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./register.scss";
import Loading from "../../components/Loading/Loading";

const Register = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // show global overlay
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
                alert("Registration successful! Please log in.");
                navigate("/login");
              }
        } catch (err) {
          const message = err?.response?.data?.message || err?.message || "Something went wrong";
          setError(message);
          console.error(err);
        } finally {
          setIsLoading(false);
          // hide global overlay
          window.dispatchEvent(new CustomEvent('globalLoading', { detail: { loading: false } }));
      }
    };
  return (
    <div className="register">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Create an Account</h1>
          <input name="username"  required type="text" placeholder="Username" />
          <input name="email" type="text" required placeholder="Email" />
          <input name="password" type="password" required placeholder="Password" />
          <button disabled={isLoading}>
            {isLoading ? (
              <span className="loading-in-button"><Loading size={20} /></span>
            ) : (
              'Register'
            )}
          </button>
           {error && <span>{error}</span> }
          <Link to="/login">Do you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src= "/bg1.jpeg" alt="background" />
      </div>
    </div>
  );
}

export default Register;
