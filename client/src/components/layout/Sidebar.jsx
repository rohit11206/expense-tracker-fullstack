import { NavLink } from "react-router-dom";
import { LayoutDashboard, ListOrdered, Target, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/expenses", icon: ListOrdered, label: "Expenses" },
  { to: "/budget", icon: Target, label: "Budget" },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 border-r bg-card shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-5 border-b">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                ₹
              </div>
              <span className="font-display text-lg font-bold">Xpense</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1 hover:bg-muted rounded-md transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t px-4 py-4">
            <p className="text-xs text-muted-foreground text-center">
              Expense Tracker v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
