import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://backend-dewgates-consults.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiRequest;