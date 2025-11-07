import { StatusCodes, ReasonPhrases } from "http-status-codes"

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  // Determine if we should log this error
  const shouldLog =
    err.log === true || // manually triggered logging
    statusCode >= 500; // server-level issue

  if (shouldLog) {
    console.error("-> Server Error:", {
      name: err.name,
      message: err.message,
      stack: err.stack,
      statusCode,
      timestamp: err.timestamp || new Date().toISOString(),
    });
  }

  const response = {
    success: false,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    ...(err.details && { details: err.details }),
    ...(err.code && { code: err.code }),
    timestamp: err.timestamp || new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};
