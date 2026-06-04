import axiosClient from "./axiosClient";

export const expenseService = {
  // GET /api/expenses
  getAll: async (params = {}) => {
    const response = await axiosClient.get("/expenses", { params });
    return response.data; // { success, data, pagination }
  },

  // GET /api/expenses/:id
  getById: async (id) => {
    const response = await axiosClient.get(`/expenses/${id}`);
    return response.data.data;
  },

  // POST /api/expenses
  create: async (data) => {
    const response = await axiosClient.post("/expenses", data);
    return response.data.data;
  },

  // PUT /api/expenses/:id
  update: async (id, data) => {
    const response = await axiosClient.put(`/expenses/${id}`, data);
    return response.data.data;
  },

  // DELETE /api/expenses/:id
  delete: async (id) => {
    const response = await axiosClient.delete(`/expenses/${id}`);
    return response.data;
  },
};
