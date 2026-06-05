import { z } from "zod";

export const createBudgetSchema = z.object({
  category: z.enum([
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Other",
  ]),

  amount: z
    .number()
    .positive("Budget amount must be greater than 0"),
});

export const updateBudgetSchema =
  createBudgetSchema.partial();