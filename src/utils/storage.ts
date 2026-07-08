/**
 * Storage abstraction for token persistence.
 * Uses expo-secure-store on native platforms, falls back to localStorage on web.
 */
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Save a value to secure storage (native) or localStorage (web).
 */
export async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.setItem(key, value);
    } catch {
      console.warn("[Storage] localStorage not available");
    }
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

/**
 * Get a value from secure storage (native) or localStorage (web).
 */
export async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === "web") {
    try {
      return localStorage.getItem(key);
    } catch {
      console.warn("[Storage] localStorage not available");
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(key);
  }
}

/**
 * Remove a value from secure storage (native) or localStorage (web).
 */
export async function removeItem(key: string): Promise<void> {
  if (Platform.OS === "web") {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn("[Storage] localStorage not available");
    }
  } else {
    await SecureStore.deleteItemAsync(key);
  }
}

// Convenience functions for auth token
export const setToken = (token: string) => setItem(TOKEN_KEY, token);
export const getToken = () => getItem(TOKEN_KEY);
export const removeToken = () => removeItem(TOKEN_KEY);

// Convenience functions for user data
export const setUser = (user: object) =>
  setItem(USER_KEY, JSON.stringify(user));
export const getUser = async () => {
  const data = await getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};
export const removeUser = () => removeItem(USER_KEY);
