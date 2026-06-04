import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema } from "@/schemas/expenseSchema";
import { CATEGORIES } from "@/utils/constants";
import { expenseService } from "@/services/expenseService";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDateInput } from "@/utils/currency";
import { Loader2 } from "lucide-react";

export function ExpenseForm({ expense, onSuccess, onCancel }) {
  const { addToast } = useToast();
  const isEdit = !!expense;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: expense?.amount?.toString() || "",
      category: expense?.category || "",
      date: expense ? formatDateInput(expense.date) : new Date().toISOString().split("T")[0],
      note: expense?.note || "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await expenseService.update(expense._id, data);
        addToast({ title: "Updated", description: "Expense updated successfully.", variant: "success" });
      } else {
        await expenseService.create(data);
        addToast({ title: "Added", description: "Expense added successfully.", variant: "success" });
      }
      onSuccess?.();
    } catch (err) {
      addToast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Amount */}
      <div className="space-y-1.5">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          {...register("amount")}
        />
        {errors.amount && (
          <p className="text-xs text-destructive">{errors.amount.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label>Category</Label>
        <Select
          value={selectedCategory}
          onValueChange={(val) => setValue("category", val, { shouldValidate: true })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-xs text-destructive">{errors.category.message}</p>
        )}
      </div>

      {/* Date */}
      <div className="space-y-1.5">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          max={new Date().toISOString().split("T")[0]}
          {...register("date")}
        />
        {errors.date && (
          <p className="text-xs text-destructive">{errors.date.message}</p>
        )}
      </div>

      {/* Note */}
      <div className="space-y-1.5">
        <Label htmlFor="note">Note <span className="text-muted-foreground">(optional)</span></Label>
        <Input
          id="note"
          placeholder="What was this for?"
          {...register("note")}
        />
      </div>

      <div className="flex gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Update Expense" : "Add Expense"}
        </Button>
      </div>
    </form>
  );
}
