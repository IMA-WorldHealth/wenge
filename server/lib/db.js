/**
* Database Connector
*
*/
var sqlite3 = require('sqlite3').verbose(),
    q       = require('q'),
    fs      = require('fs');

// export module routes
var mod = module.exports = {
  setup : setup,
  db    : null
};

/**
* Initializes a connection to the database using paramters provided in a
* configuration JSON object (via .env).  If the database does not exist, it will
* automatically build it for you.
*
* @returns null
*/
function setup() {
  'use strict';

  var rebuild, db;

  // Check to see if db exists.  If not, build it from configuration files.
  try {
    console.log('[DB] [INFO] Checking to see if database exists...');
    rebuild = !!fs.statSync(process.env.DB_PATH);
    console.log('[DB] [INFO] Using database:', process.env.DB_PATH);
  } catch (e) {
    console.log('[DB] [INFO] No database detected.');
    rebuild = true;
  }

  // connect to the database
  db = mod.db = new sqlite3.Database(process.env.DB_PATH);

  // create asynchronous versions of db functions
  db.async = {};
  db.async.run = q.nbind(db.run, db);
  db.async.get = q.nbind(db.get, db);
  db.async.all = q.nbind(db.all, db);

  // rebuild the database if necessary
  if (rebuild) { buildDB(db); }
}

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

  // build the database schema and base file if defined
  buildDBFile(db, process.env.DB_SCHEMA)
  .then(function () {

    // if dbBase exists, we also build that
    if (process.env.DB_DATA) {
      return buildDBFile(db, process.env.DB_DATA);
    }
  })
  .then(function () {
    console.log('[DB] [INFO] Finished building database.');
  })
  .catch(function (error) {
    console.log('[DB] [ERROR] ', error);
  })
  .done();
}

// parse and execute a database file provided by fPath
function buildDBFile(db, fPath) {
  'use strict';

  console.log('[DB] [INFO] Building database using:', fPath);

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
