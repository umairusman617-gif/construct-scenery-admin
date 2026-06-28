import api from "./axios";
import { ApiResponse, ContactSection } from "@/types";

export const contactApi = {
  get: () => api.get<ApiResponse<ContactSection>>("/api/contact"),
  update: (data: Partial<ContactSection>) => api.put<ApiResponse<ContactSection>>("/api/contact", data),
};
