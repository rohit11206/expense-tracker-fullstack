import { Router } from "express";

import {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget,
} from "../controllers/budget.controller.js";

import { validate } from "../middlewares/validate.middleware.js";

import {
  createBudgetSchema,
  updateBudgetSchema,
} from "../validation/budget.validation.js";

const router = Router();

router.get("/", getBudgets);

router.post(
  "/",
  validate(createBudgetSchema),
  createBudget
);

router.put(
  "/:id",
  validate(updateBudgetSchema),
  updateBudget
);

router.delete("/:id", deleteBudget);

export default router;