import { axiosClient } from "./axiosClient";
import { AuthResponse, LoginRequest, SignupRequest } from "../types/auth";

export const authApi = {
  login: (body: LoginRequest) =>
    axiosClient.post<AuthResponse>("/auth/login", body),
  signup: (body: SignupRequest) =>
    axiosClient.post<AuthResponse>("/auth/signup", body),
};
