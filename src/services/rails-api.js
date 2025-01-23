import axios from "axios";

const railsAPI = axios.create({
  baseURL: "http://localhost:4000/api/v1", // Replace with your Rails API URL
});

// Attach the token to all requests if available
railsAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default railsAPI;
