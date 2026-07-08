/**
 * User role types matching the backend data model from afan.end section 3.
 */
export type UserRole = "alumni" | "admin" | "super_admin" | "dosen";

/**
 * User data returned from the backend after login.
 */
export interface User {
  id: number;
  email: string;
  role: UserRole;
  status: "active" | "suspended";
  last_login?: string;
  privilege_level?: number;
  fakultas?: string; // Fakultas admin
  // Alumni-specific (populated if role === 'alumni')
  alumni_profile?: {
    nim: string;
    nama: string;
    prodi_id?: number;
    angkatan?: number;
    profil_completion_percent?: number;
    fakultas?: string;
    prodi?: string;
  };
}

/**
 * Auth state managed by AuthContext.
 */
export interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Login request payload.
 */
export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Register request payload (alumni only).
 */
export interface RegisterPayload {
  email: string;
  password: string;
  nama: string;
  nim: string;
  fakultas?: string;
  prodi?: string;
}

/**
 * API response for auth endpoints.
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
  };
}
