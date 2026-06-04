import * as expenseService from "../services/expense.service.js";
import { convertToCSV } from "../utils/csv.util.js";

// POST /api/expenses
export const createExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.createExpense(req.validatedData);
    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses
export const getAllExpenses = async (req, res, next) => {
  try {
    const { expenses, pagination } = await expenseService.getAllExpenses(req.query);
    res.status(200).json({
      success: true,
      data: expenses,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses/summary
export const getExpenseSummary = async (req, res, next) => {
  try {
    const summary = await expenseService.getExpenseSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses/export/csv
export const exportExpensesCSV = async (req, res, next) => {
  try {
    const expenses = await expenseService.getExpensesForExport(req.query);
    const csv = convertToCSV(expenses);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
    res.status(200).send(csv);
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses/:id
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/expenses/:id
export const updateExpense = async (req, res, next) => {
  try {
    const expense = await expenseService.updateExpense(req.params.id, req.validatedData);
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/expenses/:id
export const deleteExpense = async (req, res, next) => {
  try {
    await expenseService.deleteExpense(req.params.id);
    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
