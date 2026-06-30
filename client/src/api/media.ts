import api from "./axios";
import { ApiResponse, MediaFile } from "@/types";

export const mediaApi = {
  list: () => api.get<ApiResponse<MediaFile[]>>("/api/media"),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/api/media/${id}`),
};
