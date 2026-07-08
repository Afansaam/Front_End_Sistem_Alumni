/**
 * Axios API instance for Pusat Karir & Alumni UNUHA.
 *
 * - Base URL from app.config.ts extra.API_BASE_URL
 * - Request interceptor: attach JWT Bearer token
 * - Response interceptor: handle 401 → clear session, redirect to /masuk
 */
import axios from "axios";
import Constants from "expo-constants";
import { router } from "expo-router";
import { getToken, removeToken, removeUser } from "@/utils/storage";

const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL || "http://192.168.1.5:8000/api";

export const USE_MOCK = false; // Ubah ke false untuk menghubungkan ke API Laravel asli

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// === Request Interceptor: Attach JWT ===
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// === Response Interceptor: Handle 401 ===
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session
      await removeToken();
      await removeUser();
      router.replace("/masuk");
    }
    return Promise.reject(error);
  }
);
