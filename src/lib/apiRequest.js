import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://backend-dewgates-consults.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically append token to Authorization header if available
apiRequest.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token || user?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Error setting Authorization header in apiRequest:", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiRequest;