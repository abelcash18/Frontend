import axios from "axios";


const token  = localStorage.getItem("token");

const apiRequest = axios.create({
  baseURL: "https://backend-dewgates-consults.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
});

      
export default apiRequest;