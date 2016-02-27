/**
* Database Connector
*/
const sqlite3 = require('sqlite3').verbose();
const P       = require('bluebird');

const logger = require('../logger');

/**
* Initializes a connection to the database using paramters provided in a
* configuration JSON object (via .env).  If the database does not exist, it will
* automatically build it for you.
*
* @returns {function} db - a database connection
*/
function database() {
  'use strict';

  logger.debug('[DB] Connecting to ', process.env.DB_PATH);

  /** connect to the database file */
  let db = new sqlite3.Database(process.env.DB_PATH);


  /** replace all methods with promise equivalents */
  P.promisifyAll(db);

  return db;
}

/** expose the database to other modules */
module.exports = database();
