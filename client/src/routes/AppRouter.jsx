import { HashRouter, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Expenses from "@/pages/Expenses";
import Budget from "@/pages/Budget";
import NotFound from "@/pages/NotFound";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/budget" element={<Budget />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      </HashRouter>
  );
}
