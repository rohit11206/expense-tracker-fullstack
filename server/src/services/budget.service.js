import mongoose from "mongoose";
import Budget from "../models/Budget.model.js";
import { ApiError } from "../middlewares/error.middleware.js";

export const createBudget = async (data) => {
  const existing = await Budget.findOne({
    category: data.category,
  });

  if (existing) {
    throw new ApiError(
      409,
      `Budget already exists for ${data.category}`
    );
  }

  return await Budget.create(data);
};

export const getBudgets = async () => {
  return await Budget.find().sort({ category: 1 });
};

export const updateBudget = async (id, data) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid budget ID");
  }

  const budget = await Budget.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
};

export const deleteBudget = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid budget ID");
  }

  const budget = await Budget.findByIdAndDelete(id);

  if (!budget) {
    throw new ApiError(404, "Budget not found");
  }

  return budget;
};