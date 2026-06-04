import { useState, useCallback } from "react";
import { budgetService } from "@/services/budgetService";

export function useBudget() {
  const [budgets, setBudgets] = useState(() => budgetService.getAll());

  const updateBudget = useCallback((category, amount) => {
    const updated = budgetService.update(category, amount);
    setBudgets({ ...updated });
  }, []);

  const saveBudgets = useCallback((newBudgets) => {
    const saved = budgetService.save(newBudgets);
    setBudgets({ ...saved });
  }, []);

  return { budgets, updateBudget, saveBudgets };
}
