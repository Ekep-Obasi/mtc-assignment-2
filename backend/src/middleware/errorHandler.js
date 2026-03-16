export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack || err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      status: 400,
      error: "ValidationError",
      message: messages.join(", ")
    });
  }

  // mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      status: 409,
      error: "Conflict",
      message: "Duplicate value exists"
    });
  }

  const status = err.status || 500;
  res.status(status).json({
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    status,
    error: err.name || "ServerError",
    message: err.message || "Internal server error"
  });
};
