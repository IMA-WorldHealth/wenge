var sqlite3 = require('sqlite3').verbose(),
    q       = require('q');

var db = new sqlite3.Database('./data/database.db');

// create asynchronous versions of db functions
db.async = {};
db.async.run = q.nbind(db.run, db);
db.async.get = q.nbind(db.get, db);
db.async.all = q.nbind(db.all, db);

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
    'CREATE TABLE IF NOT EXISTS role (' +
      'id INTEGER PRIMARY KEY, label TEXT ' +
    ');'
  );

  // build the user table
  db.run(
    'CREATE TABLE IF NOT EXISTS user (' +
      'id INTEGER PRIMARY KEY, username TEXT, firstname TEXT, lastname TEXT, ' +
      'email TEXT, password TEXT, roleid INTEGER, lastactive TEXT, ' +
      'FOREIGN KEY (roleid) REFERENCES role(id) ' +
    ');'
  );

  // build the recover table (for account recovery)
  db.run(
    'CREATE TABLE IF NOT EXISTS recover (' +
      'id INTEGER PRIMARY KEY, userid INTEGER, hash TEXT, expiration DATE, ' +
      'FOREIGN KEY (userid) REFERENCES user(id)' +
    ');'
  );

  // build the signature type table
  db.run(
    'CREATE TABLE IF NOT EXISTS signaturetype (' +
      'id INTEGER PRIMARY KEY, type TEXT' +
    ');'
  );

  // build the signature table
  db.run(
    'CREATE TABLE IF NOT EXISTS signature (' +
      'id INTEGER PRIMARY KEY, level INTEGER, typeid INTEGER, userid INTEGER, ' +
      'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, ' +
      'active BOOLEAN, FOREIGN KEY (userid) REFERENCES user(id), ' +
      'FOREIGN KEY (typeid) REFERENCES signaturetype(id) ' +
    ');'
  );

  // build the project table
  db.run(
    'CREATE TABLE IF NOT EXISTS project (' +
      'id INTEGER PRIMARY KEY, code TEXT, color TEXT, createdby INTEGER, ' +
      'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, ' +
      'FOREIGN KEY (createdby) REFERENCES user(id) ' +
    ');'
  );

  // build the subproject table
  db.run(
    'CREATE TABLE IF NOT EXISTS subproject (' +
      'id INTEGER PRIMARY KEY, projectid INTEGER, label TEXT, ' +
      'timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL, ' +
      'FOREIGN KEY (projectid) REFERENCES project(id) ' +
    ');'
  );

  // build the request table
  db.run(
    'CREATE TABLE IF NOT EXISTS request (' +
      'id INTEGER PRIMARY KEY, projectid INTEGER, date TEXT, beneficiary TEXT, explanation TEXT, ' +
      'signatureA, signatureB, review TEXT, status TEXT, totalamount REAL, createdby INTEGER, ' +
      'FOREIGN KEY (projectid) REFERENCES project(id), ' +
      'FOREIGN KEY (createdby) REFERENCES user(id)' +
    ');'
  );

  // build the request detail table
  db.run(
    'CREATE TABLE IF NOT EXISTS requestdetail (' +
      'id INTEGER PRIMARY KEY, requestid INTEGER, item TEXT, budgetcode REAL, ' +
      'quantity REAL, unit TEXT, unitprice REAL, totalprice REAL, ' +
      'FOREIGN KEY (requestid) REFERENCES request(id)' +
    ');'
  );

  // build the attachment table (for static attachments to requests)
  db.run(
    'CREATE TABLE IF NOT EXISTS attachment (' +
      'id INTEGER PRIMARY KEY, requestid INTEGER, reference TEXT, ' +
      'FOREIGN KEY (requestid) REFERENCES request(id)' +
    ');'
  );
});

module.exports = db;
