/**
* Users Controller
*
* This controller implements CRUD on the users table.  It is also responsible
* for handling account resets for an individal user by generating a unique ID
* and mailing it back to the user.
*
* @module controllers/express
* @requires express
*/

import express from 'express';
import path from 'path';
import workerpool from 'workerpool';
import uuid from 'node-uuid';
import argon2 from 'argon2';

import db from '../lib/db';
import mailer from '../lib/mailer';
import logger from '../lib/logger';
import { NotFound } from '../lib/errors';

// default to 5 seconds of timeout
const pool = workerpool.pool(path.join(__dirname, '../lib/RSAWorker.js'));

/**
 *
 * POST /users/invite
 * Invite a new user to sign up for wenge.  This route will store an invitation
 * uuid and associated email, to be confirmed.
 *
 * Expects to receive an email address and a roleid.
 */
export async function invite(req, res, next) {
  // generate a uuid for this person
  const id = uuid.v4();

  const sql = 'INSERT INTO invitation (id, email) VALUES (?, ?);';

  try {
    // store the invitation in the database
    await db.run(sql, id, req.body.email, req.body.roleid);

    // now that we've stored the new invitation, we should compose an email
    // message to the person, letting them know that they have a pending
    // invitation
    const options = {
      token: id,
      address: req.body.email,
    };

    // send an email to the interested party
    await mailer('invite', req.body.email, options);

    // send to the client
    res.status(200).json({ id });
  } catch (e) { next(e); }
}


// POST /users
// Creates a new user after an invitation has been sent out.  It deletes the
// reference to the invitation if the user is successfully created.
export async function create(req, res, next) {
  const data = req.body;

  // first thing we must do is check the invitation ID to see if we actually
  // sent the user an invitation.
  let sql =
    'SELECT email, timestamp, roleid FROM invitations WHERE id = ?;';

  try {
    const invitation = await db.get(sql, data.invitationId);

    const params = [
      data.username, data.displayname, data.email, data.password,
      data.telephone, data.roleid, data.hidden,
    ];

    // next, we must create the user
    sql =
      `INSERT INTO user (username, displayname, email, password, telephone, roleid, hidden)
      VALUES (?, ?, ?, ?, ? ?);`;

    await db.run(sql, params);

    /** use worker-pool to generate a keypiar for the user */
    const keypair = await pool.exec('keypair');

    logger.info('Generated the following keypair:', keypair);

    sql =
      'INSERT INTO signature (public, private, type) VALUES (?, ?, ?);';

    await db.run(sql, [keypair.public, keypair.private, 'normal']);

    res.sentStatus(200);
  } catch (e) { next(e); }
}

/**
 * Returns the details of a single user in the database.  If the user does not exist,
 * returns a 404.
 * @method read
 */
export async function read(req, res, next) {
  const sql =
    `SELECT user.id, user.username, user.displayname, user.email,
    role.label AS role, user.hidden, user.lastactive
    FROM user JOIN role ON user.roleid = role.id
    WHERE user.id = ?;`;

  try {
    const user = await db.get(sql, req.params.id);

    if (!user) {
      throw new NotFound(`No user by the id ${req.params.id}`);
    }

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

/**
 * Returns a (potentially empty) list of all users in the database.
 * @method index
 */
export async function index(req, res, next) {
  const sql = 'SELECT user.id, user.username, user.displayname FROM user;';

  try {
    const users = await db.all(sql);
    res.status(200).json(users);
  } catch (e) {
    next(e);
  }
}

// PUT /users/:id
export async function update(req, res, next) {
  const data = req.body;
  const id = req.params.id;

  // TODO - ensure unique usernames
  const sql = 'UPDATE user SET username = ?, email = ? WHERE id = ?;';

  try {
    await db.run(sql, data.username, data.email, id);

    res.status(200).send({ id });
  } catch (e) {
    next(e);
  }
}

// POST /users/:id/password
// TODO

// DELETE /users/:id
async function del(req, res, next) {
  const sql = 'DELETE FROM user WHERE id = ?';

  try {
    await db.run(sql, req.params.id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}

export { del as delete };

// POST /users/recover
export async function recover(req, res, next) {
  const data = req.body;
  const sql = 'SELECT user.id, user.username, user.email FROM user WHERE email = ?;';

  try {
    const user = await db.get(sql, data.email);

    if (!user) {
      throw new NotFound(`No user found with email ${data.email}`);
    }

    // compose the message.  The params key will be used to template into the
    // HTML message with a templating library.
    const options = {
      token: uuid.v4(),
      address: user.email,
      subject: 'Password Reset Request',
    };

    // send the email
    await mailer('recover', user.email, options);

    res.sendStatus(200);
  } catch (e) {
    next(e);
  }
}
