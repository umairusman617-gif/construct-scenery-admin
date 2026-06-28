import api from "./axios";
import { ApiResponse, ProcessStep } from "@/types";

export const processApi = {
  list: () => api.get<ApiResponse<ProcessStep[]>>("/api/process"),
  create: (data: Partial<ProcessStep>) => api.post<ApiResponse<ProcessStep>>("/api/process", data),
  update: (id: number, data: Partial<ProcessStep>) => api.put<ApiResponse<ProcessStep>>(`/api/process/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/api/process/${id}`),
};
