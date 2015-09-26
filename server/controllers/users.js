/**
* Users Controller
*
* This controller implements CRUD on the users table.
*/

var db = require('../lib/db').db,
    crypto = require('crypto');

// exposed routes
exports.create = create;
exports.read = read;
exports.update = update ;
exports.delete = del;

// POST /users
function create(req, res, next) {
  'use strict';

  var sql =
    'INSERT INTO user (username, email, password, roleid) VALUES (?, ?, ?, ?);';

  db.async.run(sql)
  .then(function () {
    res.status(200).send(this.lastID);
  })
  .catch(next)
  .done();
}

// GET /users/:id?
function read(req, res, next) {
  'use strict';

  var sql,
      hasId = (req.params.id !== undefined);

  sql =
    'SELECT user.id, user.username, user.displayname, user.email, ' +
    'role.label AS role, user.hidden, user.lastactive ' +
    'FROM user JOIN role ON user.roleid = role.id';

  if (hasId) {
    sql += ' WHERE user.id = ?;';
  }

  db.async.all(sql, [req.params.id])
  .then(function (rows) {

    if (hasId && !rows.length) {
      return res.status(404).json({});
    }

    // only send single JSON object if hasId
    res.status(200).json(hasId ? rows[0] : rows);
  })
  .catch(next)
  .done();
}

// PUT /users/:id
function update(req, res, next) {
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

  db.async.run(sql, [req.body.username, shasum, req.body.email, req.params.id])
  .then(function () {
    res.status(200).send(this.changes);
  })
  .catch(next)
  .done();
}

// DELETE /users/:id
function del(req, res, next) {
  'use strict';

  var sql =
    'DELETE FROM user WHERE id = ?';

  db.async.run(sql, [req.params.id])
  .then(function () {
    res.status(200).send(this.changes).bind(db);
  })
  .catch(next)
  .done();
}
