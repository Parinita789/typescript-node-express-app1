import { HTTP_STATUS_CODES } from '../constants/httpStatusCodes.constants';
import {
  InternalServerError,
  BadRequestError,
  PageNotFound
} from '../utils/error.utils';

/**
 * @function
 * @description This is a helper method, which creates an error object
 * @param {*} err Javascript error object
 */
function getHttpStatusCode(err) {
  let status;
  switch (err) {
    case err instanceof BadRequestError:
      status = HTTP_STATUS_CODES.BAD_REQUEST; 
      break;
    case err instanceof PageNotFound:
      status = HTTP_STATUS_CODES.NOT_FOUND; 
      break;
    case err instanceof InternalServerError:
      status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR; 
      break;  
    default:
      status = HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  }
  return status;
}

export function handleError(err, req, res, next) {
  const status = getHttpStatusCode(err);
  res.status(status).json({
    message: err.message,
    name: err.name
  })
}
