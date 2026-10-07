import { config } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

export const notFound = (req, res, next) => {
  next(new AppError(404, `Route not found - ${req.originalUrl}`));
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle malformed JSON from express.json()
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  } else if (!err.isOperational && config.env === 'production') {
    // Hide details of unexpected errors in production
    message = 'Internal Server Error';
  }

  // Log unexpected server errors
  if (statusCode === 500) {
    console.error(`[ERROR] ${err.message}`, err.stack);
  }

  const response = {
    success: false,
    message,
    ...(err.errors && { errors: err.errors }),
  };

  // Include stack trace only in development mode
  if (config.env === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
