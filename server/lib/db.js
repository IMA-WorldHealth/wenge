var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.db');


// build the database if it doesn't exist
db.serialize(function () {

  // build the colors table
  db.run(
    'CREATE TABLE IF NOT EXISTS color (code TEXT, name TEXT, PRIMARY KEY (code));'
  );

  // build the tip table (adds useful tips to the home screen)
  db.run(
    'CREATE TABLE IF NOT EXISTS tip (id INTEGER PRIMARY KEY, body TEXT);'
  );

  // build the role table
  db.run(
    'CREATE TABLE IF NOT EXISTS role (id INTEGER PRIMARY KEY, label TEXT);'
  );

  // build the user table
  db.run(
    'CREATE TABLE IF NOT EXISTS user (' +
      'id INTEGER PRIMARY KEY, username TEXT, longname TEXT, email TEXT, password TEXT, ' +
      'roleid INTEGER, lastactive TEXT, FOREIGN KEY (roleid) REFERENCES role(id) ' +
    ');'
  );

  // build the project table
  db.run(
    'CREATE TABLE IF NOT EXISTS project (id INTEGER PRIMARY KEY, code TEXT, color TEXT);'
  );

  // build the subproject table
  db.run(
    'CREATE TABLE IF NOT EXISTS subproject (id INTEGER PRIMARY KEY, projectid INTEGER, label TEXT);'
  );

  // build the request table
  db.run(
    'CREATE TABLE IF NOT EXISTS request (' +
      'id INTEGER PRIMARY KEY, projectid INTEGER, date TEXT, beneficiary TEXT, explanation TEXT, ' +
      'signatureA, signatureB, review TEXT, status TEXT, userid INTEGER, ' +
      'FOREIGN KEY (projectid) REFERENCES project(id), ' +
      'FOREIGN KEY (userid) REFERENCES user(id)' +
    ');'
  );

  // build the requestdetail table
  db.run(
    'CREATE TABLE IF NOT EXISTS requestdetail (' +
      'id INTEGER PRIMARY KEY, requestid INTEGER, item TEXT, budgetcode REAL, ' +
      'quantity REAL, unit TEXT, unitprice REAL, totalprice REAL, ' +
      'FOREIGN KEY (requestid) REFERENCES request(id)' +
    ');'
  );
});

module.exports = db;
