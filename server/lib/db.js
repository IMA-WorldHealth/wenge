/**
* Database Connector
*
* If the databse does not exist, it wil be build
*/
var sqlite3 = require('sqlite3').verbose(),
    q       = require('q'),
    fs      = require('fs'),
    db;

// export module routes
module.exports = setup;

// setup function
function setup(cfg) {
 'use strict';

  // if the databse is already defined, simply return it
  if (!cfg && db) { return db; }

  // connect to the database
  db = new sqlite3.Database(cfg.dbPath);

  // create asynchronous versions of db functions
  db.async = {};
  db.async.run = q.nbind(db.run, db);
  db.async.get = q.nbind(db.get, db);
  db.async.all = q.nbind(db.all, db);

  // Test to see if db exists.  If not, build it!
  try {
    fs.statSync(cfg.dbPath);
  } catch (e) {
    buildSchema(db, cfg.dbSchema);
  }

  return db;
}

// builds the database schema from a file if it does not exist
function buildSchema(db, schemaPath) {
  'use strict';

  q.nfcall(fs.readFile, schemaPath, 'utf-8')
  .then(function (contents) {
     
    // SQL statements are split up by two new line characters.  We can split on
    // these and then map each statement to a databse command.
    return q.all(
      contents.split('\n\n')
      .map(function (line) {
        return db.run(line.trim());
      })
    );
  })
  .then(function () {
    console.log('[DB] [INFO] Finished building database.');
  })
  .catch(function (err) {
    console.log('[DB] [ERROR] ', err);
  })
  .done();
}
