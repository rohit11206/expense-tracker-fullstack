import { z } from "zod";
import { CATEGORIES } from "@/utils/constants";

export const expenseSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .transform((val) => parseFloat(val))
    .pipe(
      z.number({ invalid_type_error: "Amount must be a number" }).positive("Amount must be greater than 0")
    ),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => {
        const d = new Date(val);
        return !isNaN(d.getTime()) && d <= new Date();
      },
      { message: "Date cannot be in the future" }
    ),
  note: z.string().optional().default(""),
});

export const budgetSchema = z.object({
  Food: z.number().min(0).default(0),
  Transport: z.number().min(0).default(0),
  Bills: z.number().min(0).default(0),
  Entertainment: z.number().min(0).default(0),
  Other: z.number().min(0).default(0),
});
