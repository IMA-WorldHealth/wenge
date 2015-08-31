var db = require('../lib/db'),
    crypto = require('crypto');

// POST /users
exports.signup = function (req, res, next) {
  'use strict';

  var sql = 'INSERT INTO user (username, email, password, roleid) VALUES (?, ?, ?, ?);';
};

exports.getUsers = function (req, res, next) {
  'use strict';

  var sql =
    'SELECT user.id, user.username, user.email FROM user;';

  db.async.all(sql)
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
};

// GET /users/:id
exports.getUserById = function (req, res, next) {
  'use strict';
 
  var sql =
    'SELECT user.id, user.username, user.email, role.label AS role' +
    'FROM user JOIN role ON user.roleid = role.id WHERE id = ?;';

  db.get(sql, [req.params.id], function (err, rows) {
    // server error
    if (err) { return next(err); }

    // no data (NOT FOUND)
    if (!row) { return res.status(404).json(); }

    // success
    res.status(200).json(row);
  });
};

// PUT /users/:id
exports.updateUser = function (req, res, next) {
  'use strict';
  
  var sql, shasum;
  
  // TODO - super user override
  if (req.params.id !== req.session.user.id) {
    res.status(403).json({
      code : 'ERR_RESTRICTED_OPERATION',
      reason : 'Users can only edit their own personal information'
    });
  }

  // hash password with sha256 and store in db
  shasum = crypto.createHash('sha256').update(req.body.password).digest('hex');

  // TODO - ensure unique usernames
  sql =
    'UPDATE user SET username = ?, password = ?, email = ? WHERE id = ?;';

  db.run(sql, [req.body.username, shasum, req.body.email, req.params.id], function (err) {
    if (err) { return res.status(500).json(err); }
    res.status(200).send();
  });
};

// POST /users/accountrecovery
exports.userAccountRecovery = function (req, res, next) {
  'use strict';

  var sql =
    'SELECT id, username, email FROM user WHERE email = ?;';

  db.get(sql, [req.body.email], function (err, row) {

    // server error
    if (err) { return next(err); }

    // no data (NOT FOUND)
    if (!row) { return res.status(404).json(); }

    // success
    // TODO - code to send email
    res.status(200).json(row);
  });

};

