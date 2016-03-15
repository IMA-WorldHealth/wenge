/**
 * Logger
 *
 * This module is responsible for configuring logging functionality throughout
 * the application.
 *
 * @module lib/logger
 * @requires winston
 */

import * as winston from 'winston';

const logger = new winston.Logger();

/** use the prescribed log level. */
logger.level = process.env.LOG_LEVEL;

/** log to the console */
logger.add(winston.transports.Console);

/** log exceptions to the console */
logger.handleExceptions(new winston.transports.Console({ colorize: true, json: true }));

/** log errors to a file (no matter what the actual log level is) */
const errFile = process.env.LOG_ERROR_FILE || 'errors.log';

logger.add(winston.transports.File, {
  filename: errFile,
  handleExceptions: true,
  humanReadableUnhandledException: true,
});

/** add bindings for morgan to log HTTP requests */
logger.stream = {
  write: function write(message) {
    logger.info(message);
  },
};

export default logger;
