
export default class CustomError extends Error {
  constructor(message, statusCode = 500, extra = {}) {
    super(message);

    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true;
    this.timestamp = new Date().toISOString();

    if (extra.code) this.code = extra.code;
    if (extra.details) this.details = extra.details;
  }
}
