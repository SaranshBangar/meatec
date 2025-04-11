const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  // Check if error is a validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
    });
  }

  // Check for specific database errors
  if (err.code === "23505") {
    // Unique constraint violation in PostgreSQL
    return res.status(409).json({
      message: "Resource already exists",
    });
  }

  // Default server error
  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
