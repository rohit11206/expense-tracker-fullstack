import express from "express";
import cors from "cors";
import morgan from "morgan";
import { expenseRoutes } from "./routes/expense.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import budgetRoutes from "./routes/budget.routes.js";

export const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "*",
  credentials: true,
  optionsSuccessStatus: 200,
};

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/budgets", budgetRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);
