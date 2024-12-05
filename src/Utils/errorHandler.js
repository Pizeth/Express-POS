// utils/errorHandler.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

class ErrorHandler {
  static handle(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    // Detailed error response
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });

    // Optional: Log error to external service
    this.logError(err, req);
  }

  static logError(err, req) {
    // Implement logging to external service (e.g., Sentry, LogRocket)
    console.error({
      message: err.message,
      stack: err.stack,
      user: req.user?.id,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString(),
    });
  }
}

export { AppError, ErrorHandler };
