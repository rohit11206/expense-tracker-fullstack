import { useState, useEffect, useCallback } from "react";
import { budgetService } from "@/services/budgetService";
import { CATEGORIES } from "@/utils/constants";

const emptyBudgetMap = () =>
  Object.fromEntries(CATEGORIES.map((c) => [c, 0]));

export function useBudget() {
  const [budgets, setBudgets] = useState(emptyBudgetMap);
  const [budgetIds, setBudgetIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBudgets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { budgets: map, budgetIds: ids } = await budgetService.getAll();
      setBudgets(map);
      setBudgetIds(ids);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const saveBudgets = useCallback(
    async (newBudgets) => {
      const previousBudgets = budgets;
      const previousIds = budgetIds;

      setBudgets({ ...newBudgets });

      try {
        const { budgets: saved, budgetIds: ids } = await budgetService.saveAll(
          newBudgets,
          budgetIds
        );
        setBudgets(saved);
        setBudgetIds(ids);
        return true;
      } catch (err) {
        setBudgets(previousBudgets);
        setBudgetIds(previousIds);
        throw err;
      }
    },
    [budgets, budgetIds]
  );

  const updateBudget = useCallback(
    async (category, amount) => {
      const previousBudgets = budgets;
      const previousIds = budgetIds;

      setBudgets((prev) => ({ ...prev, [category]: amount }));

      try {
        const { budgets: saved, budgetIds: ids } =
          await budgetService.updateCategory(
            category,
            amount,
            budgetIds,
            budgets
          );
        setBudgets(saved);
        setBudgetIds(ids);
        return true;
      } catch (err) {
        setBudgets(previousBudgets);
        setBudgetIds(previousIds);
        throw err;
      }
    },
    [budgets, budgetIds]
  );

  const deleteBudget = useCallback(
    async (category) => {
      const previousBudgets = budgets;
      const previousIds = budgetIds;

      setBudgets((prev) => ({ ...prev, [category]: 0 }));

      try {
        const { budgets: saved, budgetIds: ids } =
          await budgetService.deleteCategory(category, budgetIds, budgets);
        setBudgets(saved);
        setBudgetIds(ids);
        return true;
      } catch (err) {
        setBudgets(previousBudgets);
        setBudgetIds(previousIds);
        throw err;
      }
    },
    [budgets, budgetIds]
  );

  return {
    budgets,
    budgetIds,
    loading,
    error,
    saveBudgets,
    updateBudget,
    deleteBudget,
    refetch: fetchBudgets,
  };
}
