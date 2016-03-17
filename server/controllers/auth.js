/* eslint no-param-reassign: 0 */
/**
* Authentication Controller
*
* This controller is responsible for access control to the server.  It supports
* basic password-based authentication and stores sessions in a cookie.
*
* @todo - migrate this to using passportjs and JSON Web Tokens based on the
* invitation email.
*/

import db from '../lib/db';
import { Unauthorized, Forbidden, NotFound } from '../lib/errors';
import crypto from 'crypto';
import logger from '../lib/logger';

// POST /auth/basic
// Logs a user into the system
export async function login(req, res, next) {
  const sql =
    `SELECT user.id, user.username, user.email, user.lastactive, role.label AS role
    FROM user JOIN role ON user.roleid = role.id
    WHERE user.username = ? AND user.password = ?;'`;

  // passwords are hashed with sha256 and stored in database
  const shasum = crypto.createHash('sha256').update(req.body.password).digest('hex');

  try {
    const user = await db.get(sql, req.body.username, shasum);

    if (!user) {
      throw new Unauthorized(`Bad username and password combination for ${req.body.username}`);
    }

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
