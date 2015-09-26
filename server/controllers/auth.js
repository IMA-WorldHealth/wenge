/**
* Authentication Controller
*
* This controller is responsible for access control to the server. 
*/

var db     = require('../lib/db').db,
    crypto =  require('crypto');

// export module routes
exports.login   = login;
exports.logout  = logout;
exports.gateway = gateway;
exports.role    = role;

// POST /login
// Logs a user into the system
function login(req, res, next) {
  'use strict';

  var sql, shasum;

  sql =
    'SELECT user.id, user.username, user.email, user.lastactive, role.label AS role ' +
    'FROM user JOIN role ON user.roleid = role.id ' +
    'WHERE user.username = ? AND user.password = ?;';

  // passwords are hashed with sha256 and stored in database
  shasum = crypto.createHash('sha256').update(req.body.password).digest('hex');

  db.async.get(sql, req.body.username, shasum)
  .then(function (row) {

    // no user found!  Respond with a 403 'Not Authorized'
    if (!row) { return res.status(403).json({ code : 'ERR_LOGIN' }); }

    // everything looks good! Create a session,
    // respond with a 200 and data
    req.session.user = row;

    // update the lastactive field
    return db.async.run('UPDATE user SET lastactive = ? WHERE id = ?;', [new Date(), row.id]);
  })
  .then(function () {
    res.status(200).json(req.session.user);
  })
  .catch(next)
  .done();
}

// GET /logout
// log a user out
function logout(req, res, next) {
  req.session.destroy(function () {
    res.status(200).send();
  });
}

// ensure a user session exists (middleware)
function gateway(req, res, next) {

  // if a session exists, allow passage
  if (req.session.user) { return next(); }

  console.log('[AUTH] Did not find a user session.');

  // send back a 403 unauthorized
  return res.status(403).json({
    code : 'ERR_NO_SESSION',
    reason : 'You are not signed into the server.'
  });
}

// allow users based on role
function role(test) {
  return function (req, res, next) {
    return (req.session.role === test) ? next() : res.status(403).json({ code : 'ERR_NOT_AUTHORIZED' });
  };
}
