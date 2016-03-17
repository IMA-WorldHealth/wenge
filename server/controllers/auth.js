/* eslint no-param-reassign: 0 */
/**
* Authentication Controller
*
* This controller is responsible for access control to the server.  It supports basic password-based
* authentication and stores sessions in a cookie.
*
* @todo - migrate this to using passportjs and JSON Web Tokens based on the invitation email.
*/

import db from '../lib/db';
import { Unauthorized, Forbidden, NotFound } from '../lib/errors';
import argon from 'argon2';
import logger from '../lib/logger';

/**
 * Basic password-based authentication for users that are registered with the system.  Passwords
 * are stored securely using the Argon2 password hashing library for NodeJS, and verified using
 * the same library.
 *
 * POST /auth/basic
 */
export async function login(req, res, next) {
  const sql =
    `SELECT user.id, user.username, user.email, user.lastactive, user.password, role.label AS role,
      user.roleid, user.projectid
    FROM user JOIN role ON user.roleid = role.id
    WHERE user.username = ?;`;

  try {
    // locate the user matching the username
    const user = await db.get(sql, req.body.username);

    if (!user) {
      throw new Unauthorized(`Bad username and password combination for ${req.body.username}`);
    }

    // passwords are hashed with argon and random salt.  Use argon to verify correctness.
    const bool = await argon.verify(user.password, req.body.password);

    if (!bool) {
      throw new Unauthorized(`Bad username and password combination for ${req.body.username}`);
    }

    // now that we are done verifying the password, remove it from the object
    delete user.password;

    // bind the user to the session
    req.session.user = user;

    // set update the with the current last active date
    await db.run('UPDATE user SET lastactive = ? WHERE id = ?;', new Date(), user.id);

    res.status(200).json(user);
  } catch (e) {
    next(e);
  }
}

// POST /auth/logout
// log a user out
export function logout(req, res) {
  req.session.destroy(() => {
    res.sentStatus(200);
  });
}

// ensure a user session exists (middleware)
export function gateway(req, res, next) {
  // if a session exists, allow passage
  if (req.session.user) { return next(); }

  logger.warn(`Unauthorised access denied from ${req.ip}.`);

  return next(new Forbidden('You are not signed into the server'));
}
