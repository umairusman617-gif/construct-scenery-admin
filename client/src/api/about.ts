import api from "./axios";
import { ApiResponse, AboutSection } from "@/types";

export const aboutApi = {
  get: () => api.get<ApiResponse<AboutSection>>("/api/about"),
  update: (data: Partial<AboutSection>) => api.put<ApiResponse<AboutSection>>("/api/about", data),
};
