/**
* Users Controller
*
* This controller implements CRUD on the users table.  It is also responsible
* for handling account resets for an individal user by generating a unique ID
* and mailing it back to the user.
*/

var fs     = require('fs'),
    path   = require('path'),
    crypto = require('crypto'),
    uuid   = require('node-uuid');

var db     = require('../lib/db').db,
    mailer = require('../lib/mailer');

// exposed routes
exports.create  = create;
exports.read    = read;
exports.update  = update ;
exports.delete  = del;
exports.recover = recover;

var emails = {
  recover: fs.readFileSync(path.join(__dirname, '../emails/recover.html'), 'utf8'),
  signup:  fs.readFileSync(path.join(__dirname, '../emails/signup.html'), 'utf8')
};

/* -------------------------------------------------------------------------- */

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

  if (hasId) { sql += ' WHERE user.id = ?;'; }

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

// POST /users/recover
function recover(req, res, next) {
  'use strict';

  var sql, message;

  sql =
    'SELECT user.id, user.username, user.email FROM user WHERE email = ?;';

  db.async.get(sql, [req.body.email])
  .then(function (user) {
    if (!user) { return res.status(404).json({ code: 'ERR_NO_USER' }); }

    // compose the message.  The params key will be used to template into the
    // HTML message with a templating library.
    message = {
      subject: 'Password Reset Request',
      html: emails.recover,
      params : {
        token : uuid.v4(),
        address : user.email
      }
    };

    return mailer.send(user.email, message);
  })
  .then(function (body) {
    res.status(200).json(body);
  })
  .catch(next)
  .done();
}
