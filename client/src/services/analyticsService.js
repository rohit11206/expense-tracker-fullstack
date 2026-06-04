import axiosClient from "./axiosClient";

export const analyticsService = {
  // GET /api/expenses/summary
  getSummary: async () => {
    const response = await axiosClient.get("/expenses/summary");
    return response.data.data;
    // { totalSpentThisMonth, highestExpense, categoryTotals }
  },
};
