class BaseError extends Error {    
  constructor(name: string, description: string) {
    super(description);
    this.name = name
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}
  
export class InternalServerError extends BaseError {
  constructor (name, description) {
    super(name, description);
  }
}
     
export class BadRequestError extends BaseError {
  constructor (name, description) {
    super(name, description);
  }
}

export class PageNotFound extends BaseError {
  constructor(name, description) {
    super(name, description);
  }
}