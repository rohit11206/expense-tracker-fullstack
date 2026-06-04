import { useState } from "react";
import { Pencil, Trash2, GripVertical } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/currency";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from "./ExpenseForm";
import { cn } from "@/lib/utils";

export function ExpenseCard({ expense, onDelete, onUpdate, dragHandleProps, isDragging }) {
  const [editOpen, setEditOpen] = useState(false);
  const color = CATEGORY_COLORS[expense.category] || "#6366f1";
  const icon = CATEGORY_ICONS[expense.category] || "📦";

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-3 rounded-xl border bg-card p-4 transition-all duration-200 hover:shadow-md",
          isDragging && "shadow-xl ring-2 ring-primary/20 rotate-[0.5deg] opacity-90"
        )}
      >
        {/* Drag handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0 touch-none"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        {/* Category icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
          style={{ backgroundColor: `${color}18` }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge
              className="text-xs shrink-0"
              style={{ backgroundColor: `${color}18`, color }}
            >
              {expense.category}
            </Badge>
            <span className="text-xs text-muted-foreground truncate">
              {formatDate(expense.date)}
            </span>
          </div>
          {expense.note && (
            <p className="text-sm text-foreground/80 mt-0.5 truncate">{expense.note}</p>
          )}
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <p className="font-mono font-semibold text-base">{formatCurrency(expense.amount)}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditOpen(true)}
            aria-label="Edit"
          >
            <Pencil className="h-3.5 w-3.5" />
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Delete">
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove <strong>{formatCurrency(expense.amount)}</strong> ({expense.category}) from your records. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(expense._id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
          </DialogHeader>
          <ExpenseForm
            expense={expense}
            onSuccess={() => {
              setEditOpen(false);
              onUpdate?.();
            }}
            onCancel={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
