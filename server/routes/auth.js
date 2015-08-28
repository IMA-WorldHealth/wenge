var db = require('../lib/db'),
    crypto =  require('crypto');

// POST /login
// Logs a user into the system
exports.login = function (req, res, next) {
  'use strict';

  var sql, shasum;

  sql =
    'SELECT user.id, user.username, user.email, user.lastactive, role.label AS role ' +
    'FROM user JOIN role ON user.roleid = role.id WHERE username = ? AND password = ?;';

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
    db.run('UPDATE user SET lastactive = ? WHERE id = ?;', [new Date(), row.id]);

    res.status(200).json(row);
  })
  .catch(next)
  .done();
};

// GET /logout
// log a user out
exports.logout = function (req, res, next) {
  req.session.destroy(function () {
    res.status(200).send();
  });
};

// ensure a user session exists (middleware)
exports.gateway = function (req, res, next) {

  // if a session exists, allow passage
  if (req.session.user) { return next(); }

  console.log('[AUTH] Did not find a user session.');

  // send back a 403 unauthorized
  return res.status(403).json({
    code : 'ERR_NO_SESSION',
    reason : 'You are not signed into the server.'
  });
};

// allow users based on role
exports.role = function (role) {
  return function (req, res, next) {
    return req.session.role === role ? next() : res.status(403).json({ code : 'ERR_NOT_AUTHORIZED' });
  };
};
