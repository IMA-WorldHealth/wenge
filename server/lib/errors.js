import util from 'util';

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
