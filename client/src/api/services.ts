import api from "./axios";
import { ApiResponse, Service } from "@/types";

export const servicesApi = {
  list: () => api.get<ApiResponse<Service[]>>("/api/services"),
  create: (data: Partial<Service>) => api.post<ApiResponse<Service>>("/api/services", data),
  update: (id: number, data: Partial<Service>) => api.put<ApiResponse<Service>>(`/api/services/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/api/services/${id}`),
};
