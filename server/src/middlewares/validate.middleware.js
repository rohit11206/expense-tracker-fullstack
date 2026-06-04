// Reusable middleware factory — pass any Zod schema to validate req.body
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // Attach parsed (coerced + cleaned) data to req for controllers to use
  req.validatedData = result.data;
  next();
};
