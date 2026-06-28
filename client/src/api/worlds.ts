import api from "./axios";
import { ApiResponse, World } from "@/types";

export const worldsApi = {
  list: () => api.get<ApiResponse<World[]>>("/api/worlds"),
  getBySlug: (slug: string) => api.get<ApiResponse<World>>(`/api/worlds/${slug}`),
  create: (data: Partial<World>) => api.post<ApiResponse<World>>("/api/worlds", data),
  update: (slug: string, data: Partial<World>) => api.put<ApiResponse<World>>(`/api/worlds/${slug}`, data),
  delete: (slug: string) => api.delete<ApiResponse<null>>(`/api/worlds/${slug}`),
};
