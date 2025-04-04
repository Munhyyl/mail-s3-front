import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL2 || "http://localhost:8082",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
