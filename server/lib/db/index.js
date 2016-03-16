/**
* Database Connector
*
* Initializes a connection to the database using paramters provided in a
* configuration JSON object (via .env).  If the database does not exist, it will
* automatically build it for you.
*
* @module lib/db
*
* @requires path
* @requires sqlite
* @requires bluebird
*/

import db from 'sqlite';
import Promise from 'bluebird';
import logger from '../logger';

logger.info(`Connecting to db: ${process.env.DB}`);

// open the database file in DB
db.open(process.env.DB, { verbose: true, Promise });

export default db;
