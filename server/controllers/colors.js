/**
* Colors Controller
*
* Currently only serves one function (serving all colors) but may be expanded
* in the future.
*/

var db = require('../lib/db').db;

// module exports
exports.read = read;


// GET /colors
function read(req, res, next) {
  'use strict';

  db.async.all('SELECT code, name FROM color;')
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
}
