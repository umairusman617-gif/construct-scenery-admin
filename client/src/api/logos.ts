import api from "./axios";
import { ApiResponse, Logo } from "@/types";

export const logosApi = {
  list: () => api.get<ApiResponse<Logo[]>>("/api/logos"),
  create: (data: Partial<Logo>) => api.post<ApiResponse<Logo>>("/api/logos", data),
  update: (id: number, data: Partial<Logo>) => api.put<ApiResponse<Logo>>(`/api/logos/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/api/logos/${id}`),
  reorder: (ids: number[]) => api.put<ApiResponse<null>>("/api/logos/reorder", { ids }),
};
