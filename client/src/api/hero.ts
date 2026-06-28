import api from "./axios";
import { ApiResponse, HeroSection } from "@/types";

export const heroApi = {
  get: () => api.get<ApiResponse<HeroSection>>("/api/hero"),
  update: (data: Partial<HeroSection>) => api.put<ApiResponse<HeroSection>>("/api/hero", data),
};
