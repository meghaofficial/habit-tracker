import { axiosPrivate } from "./axios";

export interface RoadmapFilters {
  search?: string;
  category?: string;
  page?: number;
}

export const roadmapApi = {
  // GET: /roadmaps with optional query parameters
  getList: async (filters?: RoadmapFilters) => {
    const response = await axiosPrivate.get("/api/roadmaps", {
      params: filters,
    });
    return response.data;
  },

  // POST: Create a new item
  create: async (data: any) => {
    const response = await axiosPrivate.post("/roadmaps", data);
    return response.data;
  },

  // PUT: Update an item
  update: async (data: any) => {
    const response = await axiosPrivate.put("/roadmaps", data);
    return response.data;
  },

  // DELETE: Delete an item
  delete: async (id: string) => {
    const response = await axiosPrivate.delete("/roadmaps", { data: { id } });
    return response.data;
  },
};
