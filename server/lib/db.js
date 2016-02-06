/**
* Database Connector
*/
var sqlite3 = require('sqlite3').verbose(),
    q       = require('q'),
    fs      = require('fs');

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

  var rebuild;

  /** Check to see if db exists.  If not, build it from provided base files */
  try {
    logger.debug('Setting up database ... ');
    rebuild = !!fs.statSync(process.env.DB_PATH);
    logger.debug('[DB] Building database from %s', process.env.DB_PATH);
  } catch (e) {
    logger.info('[DB] Did not find database at %s', process.env.DB_PATH);
    rebuild = true;
  }

  /** connect to the database file */
  let db = new sqlite3.Database(process.env.DB_PATH);

  // create asynchronous versions of db functions
  db.async = {};
  db.async.run = q.nbind(db.run, db);
  db.async.get = q.nbind(db.get, db);
  db.async.all = q.nbind(db.all, db);

  /** rebuild the database if necessary */
  if (rebuild) { buildDB(db); }

  return db;
}

/** expose the database to other modules */
module.exports = database();

/**
* Build the database sequentially from .sql files.  The configuration file is
* expected to contain DB_SCHEMA and optionally DB_DATA paths.  The schema is
* parsed and built, followed by the data SQL file.
*
* NOTE - these files are expected to maintain two new lines betweent each
* consecutive SQL statement.  Otherwise they will be treated as one (which may
* be confusing for error handling).
*
* @param {Object} db The database connector
*
*/
function buildDB(db) {
  'use strict';

  logger.debug('[DB] Starting database rebuild.');

  // build the database schema and base file if defined
  buildDBFile(db, process.env.DB_SCHEMA)
  .then(function () {

    // if dbBase exists, we also build that
    if (process.env.DB_DATA) {
      return buildDBFile(db, process.env.DB_DATA);
    }
  })
  .then(function () {
    logger.debug('[DB] Finished rebuilding database.');
  })
  .catch(function (error) {
    logger.error('[DB] Database building errored with %j', error);
  })
  .done();
}

// parse and execute a database file provided by fPath
function buildDBFile(db, fPath) {
  'use strict';

  logger.debug('[DB] Reading file %s.', fPath);

  return q.nfcall(fs.readFile, fPath, 'utf-8')
  .then(function (contents) {

    // SQL statements are split up by two new line characters.  We can split on
    // these and then map each statement to a databse command.
    return q.all(
      contents.split('\n\n')
      .map(function (sql) {

        // replace all newlines (regardless of OS)
        sql = sql.replace(/(\r\n|\n|\r)/gm,'');

        return db.async.run(sql);
      })
    );
  });
}
