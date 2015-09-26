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
* configuration JSON object.  If the database does not exist, it will
* automatically build it for you.
*
* @param {Object} cfg A configuration JSON with database parameters
* @returns null
*/
function setup(cfg) {
  'use strict';

  var rebuild, db;

  // Check to see if db exists.  If not, build it from configuration files.
  try {
    console.log('[DB] [INFO] Checking to see if database exists...');
    rebuild = !!fs.statSync(cfg.dbPath);
    console.log('[DB] [INFO] Using database:', cfg.dbPath);
  } catch (e) {
    console.log('[DB] [INFO] No database detected.');
    rebuild = true;
  }

  // connect to the database
  db = mod.db = new sqlite3.Database(cfg.dbPath);

  // create asynchronous versions of db functions
  db.async = {};
  db.async.run = q.nbind(db.run, db);
  db.async.get = q.nbind(db.get, db);
  db.async.all = q.nbind(db.all, db);

  if (rebuild) { buildDB(db, cfg); }
}

/**
* Build the database sequentially from .sql files.  The configuration file is
* expected to contain dbSchema and optionally dbBase paths.  The schema is
* parsed and built, followed by the base SQL file.
*
* NOTE - these files are expected to maintain two new lines betweent each
* consecutive SQL statement.  Otherwise they will be treated as one (which may
* be confusing for error handling).
*
* @param {Object} db The database connector
* @param {Object} cfg The JSON configuration object for the database
*
*/
function buildDB(db, cfg) {

  // build the database schema and base file if defined
  buildDBFile(db, cfg.dbSchema)
  .then(function () {

    // if dbBase exists, we also build that
    if (cfg.dbBase) {
      return buildDBFile(db, cfg.dbBase);
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
