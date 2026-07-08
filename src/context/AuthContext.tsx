/**
 * AuthContext — manages user authentication state across the app.
 *
 * Provides:
 * - user, token, role, isLoading, isAuthenticated state
 * - login(), logout(), register() functions
 * - Token persistence via expo-secure-store (native) / localStorage (web)
 */
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useRouter, useSegments } from "expo-router";
import {
  setToken,
  getToken,
  removeToken,
  setUser as storeUser,
  getUser as loadStoredUser,
  removeUser,
} from "@/utils/storage";
import { api, USE_MOCK } from "@/services/api";
import type {
  User,
  UserRole,
  AuthState,
  LoginPayload,
  RegisterPayload,
  AuthResponse,
} from "@/types/auth";
import { ijazahValidationService } from "@/services/mock/ijazahValidation";

interface AuthContextType extends AuthState {
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateAlumniProfile: (profile: { nama: string; nim: string; prodi?: string; fakultas?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    role: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  // === Restore session on mount ===
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await getToken();
        const storedUser = await loadStoredUser();

        if (storedToken && storedUser) {
          setState({
            user: storedUser,
            token: storedToken,
            role: storedUser.role,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("[AuthContext] Failed to restore session:", error);
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    restoreSession();
  }, []);

  // === Login ===
  const login = useCallback(
    async (payload: LoginPayload): Promise<{ success: boolean; message: string }> => {
      try {
        if (!USE_MOCK) {
          const response = await api.post<AuthResponse>("/login", payload);
          const authData = response.data.data;
          
          if (!authData || !authData.token || !authData.user) {
            return { success: false, message: response.data.message || "Email atau password salah" };
          }

          const { token, user } = authData;

          await setToken(token);
          await storeUser(user);

          setState({
            user,
            token,
            role: user.role,
            isLoading: false,
            isAuthenticated: true,
          });

          redirectByRole(user.role);
          return { success: true, message: "Login berhasil" };
        }

        // --- MOCK IMPLEMENTATION ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        // Determine role and faculty based on email/input
        let role: UserRole = "alumni";
        let fakultas: string | undefined = undefined;
        const emailLower = payload.email.toLowerCase();
        if (emailLower.includes("superadmin")) {
          role = "super_admin";
        } else if (emailLower.includes("admin")) {
          role = "admin";
          if (emailLower.includes("fai") || emailLower.includes("agama")) {
            fakultas = "Fakultas Agama Islam";
          } else if (emailLower.includes("fik") || emailLower.includes("pendidikan")) {
            fakultas = "Fakultas Ilmu Kependidikan";
          } else if (emailLower.includes("fst") || emailLower.includes("sains")) {
            fakultas = "Fakultas Sains & Teknologi";
          } else {
            fakultas = "Pusat";
          }
        }

        // Mock user data
        const user: User = {
          id: role === "super_admin" ? 99 : role === "admin" ? 88 : 1,
          email: payload.email,
          role,
          status: "active",
          fakultas,
          alumni_profile: role === "alumni" ? {
            nim: payload.email.split('@')[0] || "1902001",
            nama: "Alumni Demo",
          } : undefined
        };
        const token = "mock_token_" + Date.now();

        // Persist token and user
        await setToken(token);
        await storeUser(user);

        setState({
          user,
          token,
          role: user.role,
          isLoading: false,
          isAuthenticated: true,
        });

        // Redirect based on role
        redirectByRole(user.role);

        return { success: true, message: "Login berhasil (Mock)" };
      } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Terjadi kesalahan saat login" };
      }
    },
    [router]
  );

  // === Register ===
  const register = useCallback(
    async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
      try {
        if (!USE_MOCK) {
          const response = await api.post<AuthResponse>("/register", payload);
          const authData = response.data.data;

          if (!authData || !authData.token || !authData.user) {
            return { success: false, message: response.data.message || "Gagal melakukan registrasi" };
          }

          const { token, user } = authData;

          await setToken(token);
          await storeUser(user);

          setState({
            user,
            token,
            role: user.role,
            isLoading: false,
            isAuthenticated: true,
          });

          redirectByRole(user.role);
          return { success: true, message: "Registrasi berhasil" };
        }

        // --- MOCK IMPLEMENTATION ---
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
        
        // Sync student faculty with validation service
        if (payload.fakultas) {
          ijazahValidationService.setStudentFaculty(payload.fakultas);
        }

        // Mock user data
        const user: User = {
          id: 2,
          email: payload.email,
          role: "alumni",
          status: "active",
          alumni_profile: {
            nim: payload.nim,
            nama: payload.nama,
            fakultas: payload.fakultas,
            prodi: payload.prodi,
          }
        };
        const token = "mock_token_" + Date.now();

        await setToken(token);
        await storeUser(user);

        setState({
          user,
          token,
          role: user.role,
          isLoading: false,
          isAuthenticated: true,
        });

        redirectByRole(user.role);

        return { success: true, message: "Registrasi berhasil (Mock)" };
      } catch (error: any) {
        return { success: false, message: error.response?.data?.message || "Terjadi kesalahan saat registrasi" };
      }
    },
    [router]
  );

  // === Logout ===
  const logout = useCallback(async () => {
    await removeToken();
    await removeUser();
    setState({
      user: null,
      token: null,
      role: null,
      isLoading: false,
      isAuthenticated: false,
    });
    router.replace("/masuk");
  }, [router]);

  // === Role-based redirect ===
  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case "alumni":
        router.replace("/dashboard");
        break;
      case "admin":
        router.replace("/(admin)/admin");
        break;
      case "super_admin":
        router.replace("/(superadmin)/superadmin");
        break;
      case "dosen":
        // Dosen belum ada panel khusus, redirect ke landing
        router.replace("/");
        break;
      default:
        router.replace("/");
    }
  };

  // === Update Alumni Profile ===
  const updateAlumniProfile = useCallback(
    async (profile: { nama: string; nim: string; prodi?: string; fakultas?: string }) => {
      if (!USE_MOCK) {
        const response = await api.put<{ user: User }>("/user/profile", profile);
        const updatedUser = response.data.user;
        await storeUser(updatedUser);
        setState((prev) => ({ ...prev, user: updatedUser }));
        return;
      }

      // Mock implementation
      setState((prev) => {
        if (!prev.user) return prev;
        
        const updatedUser: User = {
          ...prev.user,
          alumni_profile: {
            ...prev.user.alumni_profile,
            nama: profile.nama,
            nim: profile.nim,
            prodi: profile.prodi || prev.user.alumni_profile?.prodi,
            fakultas: profile.fakultas || prev.user.alumni_profile?.fakultas,
          }
        };

        storeUser(updatedUser).catch((err) => console.error("Failed to store updated user:", err));

        if (profile.fakultas) {
          ijazahValidationService.setStudentFaculty(profile.fakultas);
        }

        return {
          ...prev,
          user: updatedUser
        };
      });
    },
    []
  );

  const value = useMemo<AuthContextType>(
    () => ({
      ...state,
      login,
      register,
      logout,
      updateAlumniProfile,
    }),
    [state, login, register, logout, updateAlumniProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth state and actions.
 * Must be used within an AuthProvider.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
