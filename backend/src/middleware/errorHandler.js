export const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    status: err.status || 500,
    error: err.name || "ServerError",
    message: err.message || "Internal server error",
  });
};
