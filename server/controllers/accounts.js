/**
*
*
*
*
*/

var db = require('../lib/db');

exports.recover = recover;

// POST /accounts/recover
function recover(req, res, next) {
  'use strict';

  var sql =
    'SELECT id, username, email FROM user WHERE email = ?;';

  db.getAsync(sql, [req.body.email])
  .then(function (row) {

    // no data (NOT FOUND)
    if (!row) { return res.status(404).json(); }

    // success
    // TODO - code to send email
    res.status(200).json(row);
  })
  .catch(next)
  .done();
}
