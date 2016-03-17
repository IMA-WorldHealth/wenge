/**
* Database Connector
*
* Initializes a connection to the database using paramters provided in a
* configuration JSON object (via .env).
*
* @module lib/db
*
* @requires sqlite
* @requires bluebird
* @requires lib/logger
*/

import db from 'sqlite';
import Promise from 'bluebird';
import logger from '../logger';

/**
 * Establishes a database connection to the appropriate file.
 *
 * This method exists to prevent deadlocks when building the database during
 * tests or installaition
 *
 * @method connect
 * @example
 * import server from './path/to/server';
 * import db from './path/to/db';
 *
 * // connect to the database after server start
 * server.listen(process.env.PORT, () => {
 *   db.connect();
 * });
 */
export function connect() {
  logger.info(`Connecting to db: ${process.env.DB}`);
  db.open(process.env.DB, { verbose: true, Promise });
}

/** @exports db connect */
export default db;
