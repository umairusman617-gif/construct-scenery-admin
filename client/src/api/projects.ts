import api from "./axios";
import { ApiResponse, Project } from "@/types";

export const projectsApi = {
  list: () => api.get<ApiResponse<Project[]>>("/api/projects"),
  create: (data: Partial<Project>) => api.post<ApiResponse<Project>>("/api/projects", data),
  update: (id: number, data: Partial<Project>) => api.put<ApiResponse<Project>>(`/api/projects/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/api/projects/${id}`),
};
