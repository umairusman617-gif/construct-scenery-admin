import api from "./axios";
import { ApiResponse, User } from "@/types";

export const authApi = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<{ token: string; user: User }>>("/api/auth/login", { email, password }),

  verify: () =>
    api.post<ApiResponse<{ user: User }>>("/api/auth/verify"),
};
