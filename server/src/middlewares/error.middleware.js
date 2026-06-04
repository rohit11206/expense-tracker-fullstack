import mongoose from "mongoose";

// Custom error class — throw this from services or controllers for known errors
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
  }
}

// Global error handling middleware — must be registered last in app.js
export const errorHandler = (err, req, res, next) => {
  // Known custom error
  if (err.name === "ApiError") {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Invalid MongoDB ObjectId (e.g. /api/expenses/not-an-id)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Generic server error
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
