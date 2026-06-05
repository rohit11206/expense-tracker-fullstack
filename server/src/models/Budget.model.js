import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Food",
        "Transport",
        "Bills",
        "Entertainment",
        "Other",
      ],
      unique: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0, "Budget amount cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;