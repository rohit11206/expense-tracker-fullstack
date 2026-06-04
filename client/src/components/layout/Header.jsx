import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/expenses": "Expenses",
  "/budget": "Budget Settings",
};

export function Header({ onMenuClick }) {
  const { theme, toggle } = useTheme();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || "Expense Tracker";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur px-4 lg:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h1 className="font-display text-xl font-bold">{title}</h1>
      </div>

      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
    </header>
  );
}
