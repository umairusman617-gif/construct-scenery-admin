import api from "./axios";
import { ApiResponse, Testimonial } from "@/types";

export const testimonialsApi = {
  list: () => api.get<ApiResponse<Testimonial[]>>("/api/testimonials"),
  create: (data: Partial<Testimonial>) => api.post<ApiResponse<Testimonial>>("/api/testimonials", data),
  update: (id: number, data: Partial<Testimonial>) => api.put<ApiResponse<Testimonial>>(`/api/testimonials/${id}`, data),
  delete: (id: number) => api.delete<ApiResponse<null>>(`/api/testimonials/${id}`),
};
