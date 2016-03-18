/* eslint no-param-reassign: 0 */
/**
* Authentication Controller
*
* This controller is responsible for access control to the server.  It supports basic password-based
* authentication and stores sessions in a cookie.
*
* @todo - migrate this to using passportjs and JSON Web Tokens based on the invitation email.
*/

import bcrypt from 'bcrypt';
import Promise from 'bluebird';
import db from '../lib/db';
import { Unauthorized, Forbidden, NotFound } from '../lib/errors';
import logger from '../lib/logger';

// create async functions in the bcrypt library
Promise.promisifyAll(bcrypt);

/**
 * Basic password-based authentication for users that are registered with the system.  Passwords
 * are stored securely using the Argon2 password hashing library for NodeJS, and verified using
 * the same library.
 *
 * POST /auth/basic
 */
export async function login(req, res, next) {
  const sql =
    `SELECT users.id, users.username, users.email, users.lastactive, users.password,
      roles.label AS role, users.roleid, users.projectid
    FROM users JOIN roles ON users.roleid = roles.id
    WHERE users.username = $1;`;

  const NoUser = new Unauthorized(`Bad username and password combination for ${req.body.username}`);

  try {
    // locate the user matching the username
    const user = await db.one(sql, [req.body.username]);

    // passwords are hashed with bcrypt, using a salt. We can verify them with a simple hash
    const bool = await bcrypt.compareAsync(req.body.password, user.password);

    if (!bool) {
      throw new Unauthorized(`Bad username and password combination for ${req.body.username}`);
    }

    // now that we are done verifying the password, remove it from the object
    delete user.password;

    // bind the user to the session
    req.session.user = user;

    // set update the with the current last active date
    await db.none('UPDATE "users" SET lastactive = $1 WHERE id = $2;', [new Date(), user.id]);

    res.status(200).json(user);
  } catch (error) {
    /** @todo - properly handle generic SQL errors */
    if (error instanceof Unauthorized) {
      next(error);
    } else {
      next(new Unauthorized(`Bad username and password combination for ${req.body.username}`));
    }
  }
}

// POST /auth/logout
// log a user out
export function logout(req, res) {
  req.session.destroy(() => {
    res.sendStatus(200);
  });
}

// ensure a user session exists (middleware)
export function gateway(req, res, next) {
  // if a session exists, allow passage
  if (req.session.user) { return next(); }

  logger.warn(`Unauthorised access denied from ${req.ip}.`);

  return next(new Forbidden('You are not signed into the server'));
}
