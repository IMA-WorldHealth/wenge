import util from 'util';
import logger from './logger';

/**
 * 404 HTTP Error
 */
export function NotFound(desc) {
  Error.call(this);

  this.status = 404;
  this.description = desc;
}

util.inherits(NotFound, Error);

/**
 * 500 HTTP Error
 */
export function InternalServerError(desc) {
  Error.call(this);

  this.status = 500;
  this.description = desc;
}

util.inherits(InternalServerError, Error);

/**
 * 400 HTTP Error
 */
export function BadRequest(desc) {
  Error.call(this);

  this.status = 400;
  this.description = desc;
}

util.inherits(BadRequest, Error);

/**
 * 401 HTTP Error
 */
export function Unauthorized(desc) {
  Error.call(this);

  this.status = 401;
  this.description = desc;
}

util.inherits(Unauthorized, Error);

/**
 * 403 HTTP Error
 */
export function Forbidden(desc) {
  Error.call(this);

  this.status = 403;
  this.description = desc;
}

util.inherits(Forbidden, Error);

/**
 * Application Error Handler
 */
export function handler(error, req, res, next) {
  let err;

  // logger.error(error);
  console.log(error);

  // if there is a status, it is a known error
  if (error.status) {
    err = error;

  // otherwise, make a new error
  } else {
    err = new InternalServerError(error);
  }

  // send the error back to the client
  res.status(err.status).json(err);
}
