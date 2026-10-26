import { axiosPrivate } from "./axios";

export interface RoadmapFilters {
  search?: string;
  page?: number;
  limit?: number;
  completed?: boolean;
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
    const response = await axiosPrivate.post("/api/roadmaps", data);
    return response.data;
  },

  // PUT: Update an item
  update: async (data: any) => {
    const response = await axiosPrivate.put("/api/roadmaps", data);
    return response.data;
  },

  // DELETE: Delete an item
  delete: async (id: string) => {
    const response = await axiosPrivate.delete(`/api/roadmaps/${id}`);
    return response.data;
  },

  getRoadmapByID: async (id: string) => {
    const response = await axiosPrivate.get(`/api/roadmaps/${id}`);
    return response.data;
  },

  getRoadmapCategories: async () => {
    const response = await axiosPrivate.get(`/api/roadmaps/categories`);
    return response.data;
  },

  getFullRoadmapByID: async (id: string) => {
    const response = await axiosPrivate.get(`/api/roadmaps/${id}/full`);
    return response.data;
  },

  getRoadmapTrail: async (ids: string[]) => {
    const response = await axiosPrivate.post(`/api/roadmaps/trail`, { ids });
    return response.data;
  },

  updateRoadmapStatus: async (
    id: string,
    status: "pending" | "in_progress",
  ) => {
    return axiosPrivate.patch(`/api/roadmaps/${id}/status`, {
      status,
    });
  },

  startRoadmap: async (parentID: string, childID: string) => {
    return axiosPrivate.patch("/api/roadmaps/start", {
      parentID,
      childID,
    });
  },
};
