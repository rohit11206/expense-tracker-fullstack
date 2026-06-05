import axiosClient from "./axiosClient";
import { CATEGORIES } from "@/utils/constants";

const emptyBudgetMap = () =>
  Object.fromEntries(CATEGORIES.map((c) => [c, 0]));

const docsToBudgetMap = (docs) => {
  const map = emptyBudgetMap();
  for (const doc of docs) {
    if (CATEGORIES.includes(doc.category)) {
      map[doc.category] = doc.amount;
    }
  }
  return map;
};

const docsToBudgetIds = (docs) => {
  const ids = {};
  for (const doc of docs) {
    if (CATEGORIES.includes(doc.category)) {
      ids[doc.category] = doc._id;
    }
  }
  return ids;
};

const syncCategory = async (category, amount, existingId) => {
  if (amount > 0) {
    if (existingId) {
      const doc = await budgetService.update(existingId, { amount });
      return { category, amount: doc.amount, id: doc._id };
    }
    const doc = await budgetService.create({ category, amount });
    return { category, amount: doc.amount, id: doc._id };
  }

  if (existingId) {
    await budgetService.delete(existingId);
    return { category, amount: 0, id: null };
  }

  return { category, amount: 0, id: null };
};

export const budgetService = {
  getAll: async () => {
    const response = await axiosClient.get("/budgets");
    const docs = response.data.data;
    return {
      budgets: docsToBudgetMap(docs),
      budgetIds: docsToBudgetIds(docs),
    };
  },

  create: async (data) => {
    const response = await axiosClient.post("/budgets", data);
    return response.data.data;
  },

  update: async (id, data) => {
    const response = await axiosClient.put(`/budgets/${id}`, data);
    return response.data.data;
  },

  delete: async (id) => {
    const response = await axiosClient.delete(`/budgets/${id}`);
    return response.data;
  },

  saveAll: async (budgetMap, budgetIds = {}) => {
    const results = await Promise.all(
      CATEGORIES.map((category) =>
        syncCategory(category, budgetMap[category] ?? 0, budgetIds[category])
      )
    );

    const budgets = emptyBudgetMap();
    const ids = {};

    for (const { category, amount, id } of results) {
      budgets[category] = amount;
      if (id) ids[category] = id;
    }

    return { budgets, budgetIds: ids };
  },

  updateCategory: async (category, amount, budgetIds = {}, currentBudgets = {}) => {
    const { amount: savedAmount, id } = await syncCategory(
      category,
      amount,
      budgetIds[category]
    );

    const budgets = { ...currentBudgets, [category]: savedAmount };
    const ids = { ...budgetIds };

    if (id) {
      ids[category] = id;
    } else {
      delete ids[category];
    }

    return { budgets, budgetIds: ids };
  },

  deleteCategory: async (category, budgetIds = {}, currentBudgets = {}) => {
    return budgetService.updateCategory(category, 0, budgetIds, currentBudgets);
  },
};
