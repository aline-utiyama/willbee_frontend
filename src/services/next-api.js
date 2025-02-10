import axios from "axios";

const nextAPI = axios.create({
  baseURL: "http://localhost:3000/api",
});

export default nextAPI;
