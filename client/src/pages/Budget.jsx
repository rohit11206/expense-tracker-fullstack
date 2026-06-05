import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORIES } from "@/utils/constants";
import { useBudget } from "@/hooks/useBudget";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { ErrorState } from "@/components/common/ErrorState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save, Trash2 } from "lucide-react";

const budgetFormSchema = z.object(
  Object.fromEntries(
    CATEGORIES.map((c) => [
      c,
      z.string().transform((v) => parseFloat(v) || 0).pipe(z.number().min(0, "Must be ≥ 0")),
    ])
  )
);

const categoryFieldSchema = budgetFormSchema.shape[CATEGORIES[0]];

export default function Budget() {
  const {
    budgets,
    saveBudgets,
    updateBudget,
    deleteBudget,
    loading: budgetsLoading,
    error: budgetsError,
    refetch,
  } = useBudget();
  const { summary, loading: analyticsLoading } = useAnalytics();
  const { addToast } = useToast();
  const [savingAll, setSavingAll] = useState(false);
  const [savingCategory, setSavingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: Object.fromEntries(CATEGORIES.map((c) => [c, "0"])),
  });

  useEffect(() => {
    if (!budgetsLoading) {
      reset(
        Object.fromEntries(
          CATEGORIES.map((c) => [c, budgets[c]?.toString() || "0"])
        )
      );
    }
  }, [budgetsLoading, budgets, reset]);

  const onSubmit = async (data) => {
    setSavingAll(true);
    try {
      await saveBudgets(data);
      addToast({
        title: "Saved",
        description: "All budget settings updated.",
        variant: "success",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSavingAll(false);
    }
  };

  const handleCategorySave = async (category) => {
    const raw = getValues(category);
    const parsed = categoryFieldSchema.safeParse(raw);
    if (!parsed.success) {
      addToast({
        title: "Invalid amount",
        description: parsed.error.errors[0]?.message || "Must be ≥ 0",
        variant: "destructive",
      });
      return;
    }

    setSavingCategory(category);
    try {
      await updateBudget(category, parsed.data);
      setValue(category, parsed.data.toString());
      addToast({
        title: "Saved",
        description: `${category} budget updated.`,
        variant: "success",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSavingCategory(null);
    }
  };

  const handleCategoryDelete = async (category) => {
    setDeletingCategory(category);
    try {
      await deleteBudget(category);
      setValue(category, "0");
      addToast({
        title: "Removed",
        description: `${category} budget cleared.`,
        variant: "success",
      });
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeletingCategory(null);
    }
  };

  const spentMap = {};
  summary?.categoryTotals?.forEach((c) => {
    spentMap[c.category] = c.total;
  });

  const cardsLoading = budgetsLoading || analyticsLoading;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold">Budget Settings</h2>
        <p className="text-sm text-muted-foreground">Set monthly spending limits per category</p>
      </div>

      {budgetsError && <ErrorState message={budgetsError} onRetry={refetch} />}

      <div>
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Spending Progress
        </h3>
        {cardsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => (
              <Skeleton key={c} className="h-28 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <BudgetCard
                key={category}
                category={category}
                budget={budgets[category] || 0}
                spent={spentMap[category] || 0}
                onClear={
                  budgets[category] > 0
                    ? () => handleCategoryDelete(category)
                    : undefined
                }
                clearing={deletingCategory === category}
              />
            ))}
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Set Budgets</CardTitle>
          <CardDescription>
            Save one category at a time or update all at once
          </CardDescription>
        </CardHeader>
        <CardContent>
          {budgetsLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((c) => (
                  <Skeleton key={c} className="h-10 rounded-md" />
                ))}
              </div>
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => (
                  <div key={category} className="space-y-1.5">
                    <Label htmlFor={`budget-${category}`}>{category} (₹)</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`budget-${category}`}
                        type="number"
                        min="0"
                        step="100"
                        placeholder="0"
                        className="flex-1"
                        {...register(category)}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="icon"
                        title={`Save ${category} budget`}
                        disabled={
                          savingCategory === category ||
                          deletingCategory === category ||
                          savingAll
                        }
                        onClick={() => handleCategorySave(category)}
                      >
                        {savingCategory === category ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                      {(budgets[category] || 0) > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          title={`Clear ${category} budget`}
                          disabled={
                            savingCategory === category ||
                            deletingCategory === category ||
                            savingAll
                          }
                          onClick={() => handleCategoryDelete(category)}
                        >
                          {deletingCategory === category ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    {errors[category] && (
                      <p className="text-xs text-destructive">{errors[category].message}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Button type="submit" disabled={savingAll || savingCategory || deletingCategory}>
                  {savingAll ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save All Budgets
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
