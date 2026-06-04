import { useState, useEffect, useCallback } from "react";
import { expenseService } from "@/services/expenseService";
import { useToast } from "@/context/ToastContext";

export function useExpenses(params = {}) {
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToast } = useToast();

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await expenseService.getAll(params);
      setExpenses(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const deleteExpense = async (id) => {
    try {
      await expenseService.delete(id);
      setExpenses((prev) => prev.filter((e) => e._id !== id));
      addToast({ title: "Deleted", description: "Expense removed successfully.", variant: "default" });
      return true;
    } catch (err) {
      addToast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    }
  };

  return { expenses, setExpenses, pagination, loading, error, refetch: fetchExpenses, deleteExpense };
}
