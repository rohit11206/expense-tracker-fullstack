import express from "express";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  getExpenseSummary,
  exportExpensesCSV,
} from "../controllers/expense.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "../validation/expense.validation.js";

export const expenseRoutes = express.Router();

// Analytics — must be defined BEFORE /:id so Express matches them first
expenseRoutes.get("/summary",    getExpenseSummary);
expenseRoutes.get("/export/csv", exportExpensesCSV);

// CRUD
expenseRoutes.post("/",    validate(createExpenseSchema), createExpense);
expenseRoutes.get("/",     getAllExpenses);
expenseRoutes.get("/:id",  getExpenseById);
expenseRoutes.put("/:id",  validate(updateExpenseSchema), updateExpense);
expenseRoutes.delete("/:id", deleteExpense);
