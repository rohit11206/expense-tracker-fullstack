import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: [0.01, "Amount must be a positive number"],
    },

    category: {
      type: String,
      required: true,
      enum: ["Food", "Transport", "Bills", "Entertainment", "Other"],
    },

    date: {
      type: Date,
      required: true,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const Expense = mongoose.model("Expense", expenseSchema);
