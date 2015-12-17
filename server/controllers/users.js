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
    uuid   = require('node-uuid'),
    ursa   = require('ursa');

var db     = require('../lib/db').db,
    mailer = require('../lib/mailer');

// exposed routes
exports.create  = create;
exports.read    = read;
exports.update  = update ;
exports.delete  = del;
exports.recover = recover;
exports.invite = invite;

var emails = {
  recover: fs.readFileSync(path.join(__dirname, '../emails/recover.html'), 'utf8'),
  invitation :  fs.readFileSync(path.join(__dirname, '../emails/invitation.html'), 'utf8')
};

/* -------------------------------------------------------------------------- */

// POST /users/invite
// Invite a new user to sign up for wenge.  This route will store an invitation
// uuid and associated email, to be confirmed.
//
// NOTE -- This invitation should include the users role and their signature type,
// if any.
function invite(req, res, next) {
  'use strict';

  var id, sql,
      data = req.body;

  // generate a uuid for this person
  id = uuid.v4();

  sql =
    'INSERT INTO invitation (id, email) VALUES (?, ?);';

  // store the invitation in the database
  db.async.run(sql, [id, data.email])
  .then(function () {

    // now that we've stored the new invitation, we should compose an email
    // message to the person, letting them know that they have a pending
    // invitation

    message = {
      subject: 'Invitation to Wenge',
      html: emails.invitation,
      params : {
        token : id,
        address : data.email
      }
    };

    // send the message
    return mailer.send(data.email, message);
  })
  .then(function (body) {
    
    // Success! Report to the client that we have successfully invited
    // a new user.
    res.status(200).json(body);
  })
  .catch(next)
  .done();
}

// POST /users
// Creates a new user after an invitation has been sent out.  It deletes the
// reference to the invitation if the user is successfully created.
function create(req, res, next) {
  'use strict';

  var sql,
      data = req.body;

  // first thing we must do is check the invitation ID to see if we actually
  // sent the user an invitation.
  sql =
    'SELECT email, timestamp FROM invitations WHERE id = ?;';

  db.async.get(sql, [data.invitationId])
  .then(function (row) {
    var params = [
      data.username, data.displayname, data.email, data.password,
      data.telephone, data.roleid, data.hidden
    ];

    // next, we must create the user
    sql =
      'INSERT INTO user (username, displayname, email, password, telephone, roleid, hidden) ' +
      'VALUES (?, ?, ?, ?, ? ?);';

    return db.async.run(sql, params);
  })
  .then(function () {

    // finally, we create a signature keypair for the user
    var pk = ursa.generatePrivateKey(4096),
        pubk = pk.toPublicPem('utf8'),
        privk = pk.toPrivatePem('utf8');

    sql =
      'INSERT INTO signature (public, private, type) VALUES (?, ?, ?);';

    // TODO -- get the type of signature from the invitation
    return db.async.run(sql, [pubk, privk, 'normal']);
  })
  .then(function () {
    res.status(200).json();
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
