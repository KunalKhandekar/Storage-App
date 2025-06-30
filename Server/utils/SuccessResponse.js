
export default class CustomSuccess {
  constructor(message, statusCode = 200, data = null) {
    this.success = true;
    this.message = message;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
    if (data) this.data = data;
  }

  static send(res, message, statusCode = 200, data = null) {
    const response = new CustomSuccess(message, statusCode, data);
    return res.status(statusCode).json(response);
  }
}
