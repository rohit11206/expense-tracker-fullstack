import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CATEGORIES, SORT_OPTIONS } from "@/utils/constants";

export function ExpenseFilters({ filters, onChange, onReset }) {
  const hasActiveFilters =
    filters.category || filters.startDate || filters.endDate || filters.search || filters.sort !== "date_desc";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search by note…"
            value={filters.search || ""}
            onChange={(e) => onChange("search", e.target.value)}
            className="pl-8"
          />
        </div>

        {/* Category */}
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => onChange("category", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sort || "date_desc"}
          onValueChange={(v) => onChange("sort", v)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onReset} className="gap-1.5">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Date range */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">From</span>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onChange("startDate", e.target.value)}
            className="w-[150px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">To</span>
          <Input
            type="date"
            value={filters.endDate || ""}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => onChange("endDate", e.target.value)}
            className="w-[150px]"
          />
        </div>
      </div>
    </div>
  );
}
