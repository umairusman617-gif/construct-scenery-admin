import api from "./axios";
import { ApiResponse, UploadResult } from "@/types";

export const uploadApi = {
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append("image", file);
    return api.post<ApiResponse<UploadResult>>("/api/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
