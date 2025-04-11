const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.errors,
    });
  }

  if (err.code === "23505") {
    return res.status(409).json({
      message: "Resource already exists",
    });
  }

  res.status(500).json({
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = errorHandler;
