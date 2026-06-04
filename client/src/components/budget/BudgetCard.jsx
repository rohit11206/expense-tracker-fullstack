import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/utils/currency";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "@/utils/constants";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BudgetCard({ category, budget, spent }) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOver = spent > budget && budget > 0;
  const isWarning = percentage >= 80 && !isOver;
  const color = CATEGORY_COLORS[category] || "#6366f1";
  const icon = CATEGORY_ICONS[category] || "📦";

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-5 transition-all",
        isOver && "border-destructive/40 bg-destructive/5",
        isWarning && "border-amber-500/40 bg-amber-500/5"
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-base"
            style={{ backgroundColor: `${color}18` }}
          >
            {icon}
          </div>
          <div>
            <p className="font-semibold text-sm">{category}</p>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(spent)} / {formatCurrency(budget)}
            </p>
          </div>
        </div>

        {budget > 0 && (
          <div className="flex items-center gap-1.5">
            {isOver ? (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Over budget
              </Badge>
            ) : isWarning ? (
              <Badge variant="warning" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                {percentage.toFixed(0)}%
              </Badge>
            ) : (
              <Badge variant="success" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                {percentage.toFixed(0)}%
              </Badge>
            )}
          </div>
        )}
      </div>

      <Progress
        value={percentage}
        indicatorClassName={cn(
          isOver ? "bg-destructive" : isWarning ? "bg-amber-500" : "bg-primary"
        )}
        style={{ "--progress-color": color }}
      />

      {budget === 0 && (
        <p className="text-xs text-muted-foreground mt-2">No budget set</p>
      )}
    </div>
  );
}
