// Budget is stored locally (no backend endpoint)
const STORAGE_KEY = "expense_budgets";

const DEFAULT_BUDGETS = {
  Food: 5000,
  Transport: 3000,
  Bills: 4000,
  Entertainment: 2000,
  Other: 2000,
};

export const budgetService = {
  getAll: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : { ...DEFAULT_BUDGETS };
    } catch {
      return { ...DEFAULT_BUDGETS };
    }
  },

  save: (budgets) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    return budgets;
  },

  getForCategory: (category) => {
    const budgets = budgetService.getAll();
    return budgets[category] || 0;
  },

  update: (category, amount) => {
    const budgets = budgetService.getAll();
    budgets[category] = amount;
    return budgetService.save(budgets);
  },
};
