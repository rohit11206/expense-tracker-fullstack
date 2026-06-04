import { Expense } from "../models/Expense.model.js";
import { ApiError } from "../middlewares/error.middleware.js";
import mongoose from "mongoose";

// ─── Build filter query from request query params ──────────────────────────────
const buildFilter = (query) => {
  const filter = {};

  if (query.category) {
    filter.category = query.category;
  }

  if (query.startDate || query.endDate) {
    filter.date = {};
    if (query.startDate) filter.date.$gte = new Date(query.startDate);
    if (query.endDate)   filter.date.$lte = new Date(query.endDate);
  }

  return filter;
};

// ─── Create Expense ────────────────────────────────────────────────────────────
export const createExpense = async (data) => {
  const expense = new Expense(data);
  await expense.save();
  return expense;
};

// ─── Get All Expenses (with filter + pagination + sort) ───────────────────────
export const getAllExpenses = async (query) => {
  const page  = parseInt(query.page)  || 1;
  const limit = parseInt(query.limit) || 10;
  const skip  = (page - 1) * limit;

  // Default: newest first; supports ?sort=date_asc | date_desc | amount_asc | amount_desc
  const sortMap = {
    date_desc:   { date: -1 },
    date_asc:    { date:  1 },
    amount_desc: { amount: -1 },
    amount_asc:  { amount:  1 },
  };
  const sort = sortMap[query.sort] || { date: -1 };

  const filter = buildFilter(query);

  const [expenses, total] = await Promise.all([
    Expense.find(filter).sort(sort).skip(skip).limit(limit),
    Expense.countDocuments(filter),
  ]);

  return {
    expenses,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single Expense by ID ─────────────────────────────────────────────────
export const getExpenseById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await Expense.findById(id);
  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

// ─── Update Expense ───────────────────────────────────────────────────────────
export const updateExpense = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await Expense.findById(id);
  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  Object.assign(expense, data);
  await expense.save();
  return expense;
};

// ─── Delete Expense ───────────────────────────────────────────────────────────
export const deleteExpense = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid expense ID");
  }

  const expense = await Expense.findByIdAndDelete(id);
  if (!expense) {
    throw new ApiError(404, "Expense not found");
  }

  return expense;
};

// ─── Summary (Analytics) ─────────────────────────────────────────────────────
/*
  Aggregation Pipeline Explanation:
  1. $match — filter only current month's expenses
  2. $group by null — sum all amounts to get totalSpentThisMonth
  3. A separate pipeline finds the single highest expense
  4. Another pipeline groups by category to get per-category totals
*/
export const getExpenseSummary = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  // Total spent this month
  const monthlyResult = await Expense.aggregate([
    { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  // Highest single expense (all time)
  const highestResult = await Expense.aggregate([
    { $sort: { amount: -1 } },
    { $limit: 1 },
  ]);

  // Category totals (all time)
  const categoryTotals = await Expense.aggregate([
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
    { $sort: { total: -1 } },
    { $project: { _id: 0, category: "$_id", total: 1 } },
  ]);

  return {
    totalSpentThisMonth: monthlyResult[0]?.total || 0,
    highestExpense: highestResult[0] || null,
    categoryTotals,
  };
};

// ─── Export CSV Data ───────────────────────────────────────────────────────────
export const getExpensesForExport = async (query) => {
  const filter = buildFilter(query);
  const expenses = await Expense.find(filter).sort({ date: -1 }).lean();
  return expenses;
};
