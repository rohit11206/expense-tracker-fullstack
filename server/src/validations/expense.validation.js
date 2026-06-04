import { z } from "zod";

const VALID_CATEGORIES = ["Food", "Transport", "Bills", "Entertainment", "Other"];

// Used for creating an expense
export const createExpenseSchema = z.object({
  amount: z
    .number({ invalid_type_error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),

  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({
      message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    }),
  }),

  date: z.coerce
    .date({ invalid_type_error: "Date must be a valid date" })
    .refine((d) => d <= new Date(), {
      message: "Date cannot be in the future",
    }),

  note: z.string().optional(),
});

// Used for updating an expense — all fields optional
export const updateExpenseSchema = createExpenseSchema.partial();
