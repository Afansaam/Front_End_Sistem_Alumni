/**
 * Mock user data for testing login.
 * In production, auth is handled entirely by the backend.
 */
import type { User, AuthResponse } from "@/types/auth";

const mockUsers: Array<User & { password: string }> = [
  {
    id: 1,
    email: "alumni@unuha.ac.id",
    password: "alumni123",
    role: "alumni",
    status: "active",
    last_login: "2026-07-04T10:00:00Z",
    alumni_profile: {
      nim: "20190101001",
      nama: "Ahmad Fauzi",
      prodi_id: 1,
      angkatan: 2019,
      profil_completion_percent: 65,
    },
  },
  {
    id: 2,
    email: "admin@unuha.ac.id",
    password: "admin123",
    role: "admin",
    status: "active",
    last_login: "2026-07-04T08:00:00Z",
    privilege_level: 2,
  },
  {
    id: 3,
    email: "superadmin@unuha.ac.id",
    password: "superadmin123",
    role: "super_admin",
    status: "active",
    last_login: "2026-07-04T09:00:00Z",
    privilege_level: 5,
  },
];

/**
 * Simulate login against mock data.
 * Returns the same shape as the real POST /api/auth/login endpoint.
 */
export function mockLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userData } = user;
        resolve({
          success: true,
          message: "Login berhasil",
          data: {
            user: userData,
            token: `mock_jwt_token_${user.role}_${Date.now()}`,
          },
        });
      } else {
        resolve({
          success: false,
          message: "Email atau password salah",
        });
      }
    }, 800); // Simulate network latency
  });
}

/**
 * Simulate register against mock data.
 */
export function mockRegister(
  email: string,
  _password: string,
  nama: string,
  nim: string
): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const exists = mockUsers.find((u) => u.email === email);
      if (exists) {
        resolve({
          success: false,
          message: "Email sudah terdaftar",
        });
      } else {
        resolve({
          success: true,
          message: "Registrasi berhasil",
          data: {
            user: {
              id: mockUsers.length + 1,
              email,
              role: "alumni",
              status: "active",
              alumni_profile: {
                nim,
                nama,
                profil_completion_percent: 0,
              },
            },
            token: `mock_jwt_token_alumni_${Date.now()}`,
          },
        });
      }
    }, 800);
  });
}
