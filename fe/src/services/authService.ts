import { authApi } from "../api/authApi";
import { AuthResponse } from "../types/auth";
import { storageService } from "./storageService";

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (!email || !password) throw new Error("Email and password required");
    const { data } = await authApi.login({ email, password });
    storageService.setToken(data.token);
    return data;
  },

  async signup(
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<AuthResponse> {
    if (!email || !password || !confirmPassword) {
      throw new Error("All fields are required");
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const { data } = await authApi.signup({ email, password });
    storageService.setToken(data.token);
    return data;
  },

  logout(): void {
    storageService.removeToken();
  },
};
