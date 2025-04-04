import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL1 || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
