class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
  
class InterServerError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @function
 * @description This is a helper method, which creates an error object
 * @param {*} err Javascript error object
 */

export class ErrorHandler {

  getErrorType(err) {
    const obj = {
      name: err.name,
      message: err.message,
      status: 0,
      errorResponse: {},
    };
  
    if (err instanceof ValidationError) {
      obj.status = 400; // Bad Request
    } else if (err instanceof InterServerError) {
      obj.status = 500; // Internal Server Error
    } else {
      obj.status = 500;
    }
    return obj;
  }
}