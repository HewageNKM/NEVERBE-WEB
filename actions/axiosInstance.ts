import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV == "production"
      ? "https://api.neverbe.lk/api/v1"
      : "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
