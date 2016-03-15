/**
 * Accounts Management
 *
 *
 *
 */

import db from '../lib/db';

// POST /accounts/recover
async function recover(req, res, next) {
  const sql =
    `SELECT id, username, email FROM user WHERE email = ?;`;

  try {
    const row = await db.get(sql, req.body.email);
    res.status(200).json(row);
  } catch (e) {
    next(e);
  }
}
