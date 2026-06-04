import { useState, useCallback } from "react";
import { Plus, Download, GripVertical } from "lucide-react";
import { useExpenses } from "@/hooks/useExpenses";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseFilters } from "@/components/expenses/ExpenseFilters";
import { ExpensePagination } from "@/components/expenses/ExpensePagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { useToast } from "@/context/ToastContext";
import axiosClient from "@/services/axiosClient";
import { cn } from "@/lib/utils";

const DEFAULT_FILTERS = {
  sort: "date_desc",
  category: "",
  startDate: "",
  endDate: "",
  search: "",
  page: 1,
  limit: 10,
};

export default function Expenses() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [addOpen, setAddOpen] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const { addToast } = useToast();

  // Build API params (search is client-side filtered, not sent to API)
  const apiParams = {
    sort: filters.sort,
    category: filters.category || undefined,
    startDate: filters.startDate || undefined,
    endDate: filters.endDate || undefined,
    page: filters.page,
    limit: filters.limit,
  };

  const { expenses, setExpenses, pagination, loading, error, refetch, deleteExpense } =
    useExpenses(apiParams);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: key !== "page" ? 1 : value }));
  }, []);

  const handleReset = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Client-side search filter on note
  const displayedExpenses = filters.search
    ? expenses.filter((e) =>
        e.note?.toLowerCase().includes(filters.search.toLowerCase())
      )
    : expenses;

  const handleExportCSV = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.set("category", filters.category);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
      const response = await axiosClient.get(`/expenses/export/csv?${params}`, { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "expenses.csv";
      a.click();
      URL.revokeObjectURL(url);
      addToast({ title: "Exported", description: "CSV downloaded.", variant: "success" });
    } catch {
      addToast({ title: "Export failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">All Expenses</h2>
          {pagination && (
            <p className="text-sm text-muted-foreground">{pagination.total} total records</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDragMode((v) => !v)}
            className={cn(isDragMode && "bg-primary/10 border-primary/30 text-primary")}
          >
            <GripVertical className="h-4 w-4" />
            {isDragMode ? "Exit Custom Order" : "Custom Order"}
          </Button>
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
              <ExpenseForm
                onSuccess={() => { setAddOpen(false); refetch(); }}
                onCancel={() => setAddOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Drag mode banner */}
      {isDragMode && (
        <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2.5 text-sm text-primary">
          <GripVertical className="h-4 w-4 shrink-0" />
          Custom order mode — drag expenses to reorder. This won't affect the default date sort.
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Filter & Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseFilters
            filters={filters}
            onChange={handleFilterChange}
            onReset={handleReset}
          />
        </CardContent>
      </Card>

      {/* List */}
      <ExpenseList
        expenses={displayedExpenses}
        setExpenses={setExpenses}
        loading={loading}
        error={error}
        onDelete={deleteExpense}
        onUpdate={refetch}
        isDragMode={isDragMode}
      />

      {/* Pagination */}
      <ExpensePagination
        pagination={pagination}
        onPageChange={(p) => handleFilterChange("page", p)}
      />
    </div>
  );
}
