import { useState } from "react";
import { TrendingUp, Award, Receipt, Tag, BarChart3, PieChart, Plus, Download } from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { formatCurrency } from "@/utils/currency";
import { CATEGORY_ICONS } from "@/utils/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CategoryPieChart } from "@/components/charts/CategoryPieChart";
import { CategoryBarChart } from "@/components/charts/CategoryBarChart";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import axiosClient from "@/services/axiosClient";
import { useToast } from "@/context/ToastContext";

function StatCard({ icon: Icon, label, value, sub, color, loading }) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-5">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground font-medium">{label}</p>
              <div
                className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}18` }}
              >
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <p className="font-display text-2xl font-bold tracking-tight">{value}</p>
            {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { summary, loading, error, refetch } = useAnalytics();
  const [addOpen, setAddOpen] = useState(false);
  const { addToast } = useToast();

  const handleExportCSV = async () => {
    try {
      const response = await axiosClient.get("/expenses/export/csv", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      a.click();
      URL.revokeObjectURL(url);
      addToast({ title: "Exported", description: "CSV downloaded successfully.", variant: "success" });
    } catch {
      addToast({ title: "Export failed", description: "Could not download CSV.", variant: "destructive" });
    }
  };

  const topCategory = summary?.categoryTotals?.[0];
  const totalExpenses = summary?.categoryTotals?.reduce((s, c) => s + c.total, 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">Overview</h2>
          <p className="text-sm text-muted-foreground">Your spending at a glance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Expense</DialogTitle>
              </DialogHeader>
              <ExpenseForm onSuccess={() => { setAddOpen(false); refetch(); }} onCancel={() => setAddOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && <ErrorState message={error} onRetry={refetch} />}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total This Month"
          value={formatCurrency(summary?.totalSpentThisMonth, true)}
          color="#6366f1"
          loading={loading}
        />
        <StatCard
          icon={Award}
          label="Highest Expense"
          value={formatCurrency(summary?.highestExpense?.amount, true)}
          sub={summary?.highestExpense ? `${summary.highestExpense.category} · ${summary.highestExpense.note || "—"}` : undefined}
          color="#ec4899"
          loading={loading}
        />
        <StatCard
          icon={Receipt}
          label="Total All Time"
          value={formatCurrency(totalExpenses, true)}
          color="#22d3ee"
          loading={loading}
        />
        <StatCard
          icon={Tag}
          label="Top Category"
          value={topCategory ? `${CATEGORY_ICONS[topCategory.category]} ${topCategory.category}` : "—"}
          sub={topCategory ? formatCurrency(topCategory.total) : undefined}
          color="#f59e0b"
          loading={loading}
        />
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card><CardContent className="p-5"><Skeleton className="h-[300px]" /></CardContent></Card>
          <Card><CardContent className="p-5"><Skeleton className="h-[300px]" /></CardContent></Card>
        </div>
      ) : !summary?.categoryTotals?.length ? (
        <EmptyState
          icon={BarChart3}
          title="No chart data available"
          description="Add some expenses to see spending charts."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-primary" />
                <CardTitle>Category Split</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CategoryPieChart data={summary.categoryTotals} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                <CardTitle>Spending by Category</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CategoryBarChart data={summary.categoryTotals} />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
