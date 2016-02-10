/**
* Users Controller
*
* This controller implements CRUD on the users table.  It is also responsible
* for handling account resets for an individal user by generating a unique ID
* and mailing it back to the user.
*/

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');
const fork   = require('child_process').fork;
const q      = require('q');
const uuid   = require('node-uuid');

const db     = require('../lib/db');
const mailer = require('../lib/mailer');
const logger = require('../lib/logger');

// default to 5 seconds of timeout
const timeout = process.env.KEY_TIMOUT || 5000;

// spin up a new worker instance of the RSA worker
let worker = fork('../lib/RSAWorker');

/** creates a new user **/
exports.create  = create;

/** lists all users registered in the database */
exports.list = list;

/** get the user details of a single user */
exports.detail = detail;

/** updates a particular user */
exports.update  = update;

/** deletes a user from the database */
exports.delete  = del;

/** sends a recovery email to the user */
exports.recover = recover;

/** sends an invitation to an email address */
exports.invite = invite;

/** emails templates */
const emails = {
  recover:    fs.readFileSync(path.join(__dirname, '../emails/recover.html'), 'utf8'),
  invitation: fs.readFileSync(path.join(__dirname, '../emails/invitation.html'), 'utf8')
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

   var data = req.body;

  // generate a uuid for this person
  let id = uuid.v4();

  let sql =
    'INSERT INTO invitation (id, email) VALUES (?, ?);';

  // store the invitation in the database
  db.runAsync(sql, [id, data.email])
  .then(function () {

    // now that we've stored the new invitation, we should compose an email
    // message to the person, letting them know that they have a pending
    // invitation

    var message = {
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

  db.getAsync(sql, [ data.invitationId ])
  .then(function () {
    var params = [
      data.username, data.displayname, data.email, data.password,
      data.telephone, data.roleid, data.hidden
    ];

    // next, we must create the user
    sql =
      'INSERT INTO user (username, displayname, email, password, telephone, roleid, hidden) ' +
      'VALUES (?, ?, ?, ?, ? ?);';

    return db.runAsync(sql, params);
  })
  .then(function () {
    let dfd = q.defer();

    logger.info('Attempting to generate keypair');

    // ask the RSA library to create a new keypair for a user
    worker.send('keypair');

    // set a timer in case the worker takes too long
    let timer = setTimeout(() => {

      // throw an error
      dfd.reject('TIMEOUT');

      // kill the child process with impunity
      worker.kill();

      // restart a new worker as needed
      worker = fork('../lib/RSAWorker');
    }, timeout);

    // listen to the workers actions in case it errors out.
    worker.on('message', (msg) => {
      dfd.resolve(msg);
      clearTimeout(timer);
    });

    /** @todo -- get the type of signature from the invitation */
    return dfd.promise;
  })
  .then(function (keypair) {

    logger.info('generated the following keypair:', keypair);

    sql =
      'INSERT INTO signature (public, private, type) VALUES (?, ?, ?);';

    return db.runAsync(sql, [keypair.public, keypair.private, 'normal']);
  })
  .then(function () {
    res.status(200).json();
  })
  .catch(next)
  .done();
}

/**
 * @method detail
 *
 * @description returns the details of a single user in the database.  If the
 * user does not exist, returns a 404.
 */
function detail(req, res, next) {
  var sql =
      'SELECT user.id, user.username, user.displayname, user.email, ' +
      'role.label AS role, user.hidden, user.lastactive ' +
      'FROM user JOIN role ON user.roleid = role.id ' +
      'WHERE user.id = ?';

  db.getAsync(sql, [req.params.id])
  .then(function (user) {
    if (!user) {
      return res.sendStatus(404);
    }
    res.status(200).json(user);
  })
  .catch(next)
  .done();
}

/**
 * @method list
 *
 * @description returns a (potentially empty) list of all users in the database.
 */
function list(req, res, next) {
  'use strict';

  var sql =
    'SELECT user.id, user.username, user.displayname FROM user;';

  db.allAsync(sql)
  .then(function (rows) {
    res.status(200).json(rows);
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
    return res.sendStatus(403);
  }

  // hash password with sha256 and store in db
  shasum = crypto.createHash('sha256').update(req.body.password).digest('hex');

  // TODO - ensure unique usernames
  sql =
    'UPDATE user SET username = ?, password = ?, email = ? WHERE id = ?;';

  db.runAsync(sql, [req.body.username, shasum, req.body.email, req.params.id])
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

  db.runAsync(sql, [req.params.id])
  .then(function () {
    res.status(200).send(this.changes).bind(db);
  })
  .catch(next)
  .done();
}

// POST /users/recover
function recover(req, res, next) {
  'use strict';

  var sql;

  sql =
    'SELECT user.id, user.username, user.email FROM user WHERE email = ?;';

  db.getAsync(sql, [req.body.email])
  .then(function (user) {
    if (!user) { return res.status(404).json({ code: 'ERR_NO_USER' }); }

    // compose the message.  The params key will be used to template into the
    // HTML message with a templating library.
    var message = {
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
