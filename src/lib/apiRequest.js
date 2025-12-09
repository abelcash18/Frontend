import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://backend-dewgates-consults.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiRequest.interceptors.request.use(
  (config) => {
    try {
        const raw = localStorage.getItem("user");
      let token = null;
      if (raw) {
        const parsed = JSON.parse(raw);
        const candidates = [
          "accessToken",
          "token",
          "authToken",
          "jwt",
          "access_token",
        ];

        const findToken = (obj) => {
          if (!obj || typeof obj !== "object") return null;
          for (const k of candidates) {
            if (obj[k]) return obj[k];
          }
            if (obj.user && typeof obj.user === "object") {
            for (const k of candidates) if (obj.user[k]) return obj.user[k];
          }
          if (obj.data && typeof obj.data === "object") {
            for (const k of candidates) if (obj.data[k]) return obj.data[k];
          }
          return null;
        };

        token = findToken(parsed) || findToken(parsed?.user) || findToken(parsed?.data);
      }

      if (!token) {
        token = localStorage.getItem("token") || sessionStorage.getItem("token") || null;
      }

      if (token) {
        config.headers = config.headers || {};
        if (!config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
    }
    return config;
  },
  (err) => Promise.reject(err)
);

export default apiRequest;