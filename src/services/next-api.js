import axios from "axios";

const nextAPI = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your Rails API URL
});

// Attach the token to all requests if available
// nextAPI.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default nextAPI;
