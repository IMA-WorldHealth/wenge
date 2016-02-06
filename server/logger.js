/**
 * Logger
 *
 * This module is responsible for configuring logging functionality.
 */

const winston = require('winston');

function configure() {
  'use strict';

  const logger = new (winston.Logger)();

  /** use the prescribed log level. */
  logger.level = process.env.LOG_LEVEL;

  /** log to the console */
  logger.add(winston.transports.Console);

  /** log errors to a file (no matter what the actual log level is) */
  var errFile = process.env.LOG_ERROR_FILE || 'errors.log';
  logger.add(winston.transports.File, {
    filename : errFile,
    handleExceptions: true,
    humanReadableUnhandledException: true
  });

  /** add bindings for morgan to log HTTP requests */
  logger.stream = {
    write : function write(message) {
      logger.info(message);
    }
  };

  return logger;
}

module.exports = configure();
