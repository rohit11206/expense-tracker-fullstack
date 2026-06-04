import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CATEGORIES } from "@/utils/constants";
import { useBudget } from "@/hooks/useBudget";
import { useAnalytics } from "@/hooks/useAnalytics";
import { BudgetCard } from "@/components/budget/BudgetCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Save } from "lucide-react";

const budgetFormSchema = z.object(
  Object.fromEntries(
    CATEGORIES.map((c) => [
      c,
      z.string().transform((v) => parseFloat(v) || 0).pipe(z.number().min(0, "Must be ≥ 0")),
    ])
  )
);

export default function Budget() {
  const { budgets, saveBudgets } = useBudget();
  const { summary, loading: analyticsLoading } = useAnalytics();
  const { addToast } = useToast();
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: Object.fromEntries(CATEGORIES.map((c) => [c, budgets[c]?.toString() || "0"])),
  });

  const onSubmit = async (data) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 300));
    saveBudgets(data);
    addToast({ title: "Saved", description: "Budget settings updated.", variant: "success" });
    setSaving(false);
  };

  // Map categoryTotals to { [category]: spent }
  const spentMap = {};
  summary?.categoryTotals?.forEach((c) => {
    spentMap[c.category] = c.total;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-2xl font-bold">Budget Settings</h2>
        <p className="text-sm text-muted-foreground">Set monthly spending limits per category</p>
      </div>

      {/* Progress Overview */}
      <div>
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
          Spending Progress
        </h3>
        {analyticsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((c) => <Skeleton key={c} className="h-28 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((category) => (
              <BudgetCard
                key={category}
                category={category}
                budget={budgets[category] || 0}
                spent={spentMap[category] || 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Budget Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Set Budgets</CardTitle>
          <CardDescription>Enter your monthly budget limit for each category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {CATEGORIES.map((category) => (
                <div key={category} className="space-y-1.5">
                  <Label htmlFor={`budget-${category}`}>{category} (₹)</Label>
                  <Input
                    id={`budget-${category}`}
                    type="number"
                    min="0"
                    step="100"
                    placeholder="0"
                    {...register(category)}
                  />
                  {errors[category] && (
                    <p className="text-xs text-destructive">{errors[category].message}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Save Budgets
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
