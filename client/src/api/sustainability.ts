import api from "./axios";
import { ApiResponse, SustainabilitySection, SustainabilityItem } from "@/types";

export const sustainabilityApi = {
  get: () => api.get<ApiResponse<SustainabilitySection>>("/api/sustainability"),
  updateSection: (data: Partial<SustainabilitySection>) =>
    api.put<ApiResponse<SustainabilitySection>>("/api/sustainability", data),
  createItem: (data: Partial<SustainabilityItem>) =>
    api.post<ApiResponse<SustainabilityItem>>("/api/sustainability/items", data),
  updateItem: (id: number, data: Partial<SustainabilityItem>) =>
    api.put<ApiResponse<SustainabilityItem>>(`/api/sustainability/items/${id}`, data),
  deleteItem: (id: number) =>
    api.delete<ApiResponse<null>>(`/api/sustainability/items/${id}`),
};
