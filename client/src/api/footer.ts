import api from "./axios";
import { ApiResponse, FooterSection } from "@/types";

export const footerApi = {
  get: () => api.get<ApiResponse<FooterSection>>("/api/footer"),
  update: (data: Partial<FooterSection>) => api.put<ApiResponse<FooterSection>>("/api/footer", data),
};
