import axios from "axios";
import { storageService } from "../services/storageService";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token on every request
axiosClient.interceptors.request.use((config) => {
  const token = storageService.getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
