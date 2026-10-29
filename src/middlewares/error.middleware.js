import mongoose from "mongoose";
import ApiError from "../utils/ApiErrors.js";

/**
 * 404 handler — placed AFTER all routes, BEFORE error middleware.
 * Converts "no route matched" into a proper ApiError.
 */
const notFoundHandler = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/**
 * Centralized error middleware.
 * - Detects and converts common Mongoose/known errors
 * - Sends a consistent error response shape
 * - Hides stack traces and internal details in production
 */
const errorHandler = (err, req, res, next) => {
  // Default: assume unexpected error
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  let details = err.details || null;

  // 🧩 Mongoose: invalid ObjectId (CastError)
  if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 🧩 Mongoose: validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // 🧩 MongoDB: duplicate key (unique index)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate value for field: ${field}`;
    details = err.keyValue;
  }

  // 🧩 JWT errors (in case we let them bubble)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
  }

  // Log unexpected (non-operational) errors with full stack
  if (!err.isOperational && statusCode >= 500) {
    console.error("💥 Unexpected error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(details ? { details } : {}),
      ...(process.env.NODE_ENV === "development" && !err.isOperational
        ? { stack: err.stack }
        : {}),
    },
  });
};

export { errorHandler, notFoundHandler };
