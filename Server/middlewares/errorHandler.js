import { StatusCodes, ReasonPhrases } from "http-status-codes"

export const errorHandler = (err, req, res, next) => {
  console.error("-> Error Handler:", err);

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const response = {
    success: false,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
    ...(err.details && { details: err.details }),
    ...(err.code && { code: err.code }),
    timestamp: err.timestamp || new Date().toISOString(),
  };

  res.status(statusCode).json(response);
};
