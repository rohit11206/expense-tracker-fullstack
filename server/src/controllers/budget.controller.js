import * as budgetService from "../services/budget.service.js";

export const createBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.createBudget(req.body);

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudgets = async (req, res, next) => {
  try {
    const budgets = await budgetService.getBudgets();

    res.status(200).json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (req, res, next) => {
  try {
    const budget = await budgetService.updateBudget(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (req, res, next) => {
  try {
    await budgetService.deleteBudget(req.params.id);

    res.status(200).json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};