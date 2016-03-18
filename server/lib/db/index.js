/**
* Database Connector
*
* Initializes a connection to the database using environmental variables loaded
* into the process.  For convience and portability, use `.env`.
*
* @module lib/db
*
* @requires bluebird
* @requires pg-promise
* @requires lib/logger
*/

import Promise from 'bluebird';
import pgp from 'pg-promise';
import logger from '../logger';

/**
 * Establishes a database connection using the postgres promise library.
 */
logger.info(`[db] connecting to ${process.env.DBURL}`);
const db = pgp({ promiseLib: Promise })(process.env.DBURL);

/** @exports connection */
export default db;
