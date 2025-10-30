import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";


function Login() {
 const [error, setError] = useState("");
 const [isLoading, setIsLoading] = useState(false);

 const {updateUser} =  useContext(AuthContext);
      const navigate =useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

        try {
          const res = await fetch("http://localhost:8800/backend/auth/login", {
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
         console.log("payload:", payload);
           const newUser = payload?.user || payload;
           console.debug("newUser (normalized):", newUser);
            updateUser(newUser);
          navigate("/");
        } catch (err) {
          const message = err?.message || "Something went wrong";
          setError(message);
          console.error(err);
        } finally {
          setIsLoading(false);
        }
  };

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required type="text" placeholder="Username" />
          <input name="password" type="password" required placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg2.jpeg" alt="" />
      </div>
    </div>
  );
}

export default Login;
