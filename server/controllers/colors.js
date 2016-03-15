/**
* Colors Controller
*
* Currently only serves one function (serving all colors) but may be expanded
* in the future.
*
* @module colors
* @requires ../lib/db
*/

import db from '../lib/db';

// GET /colors
export async function read(req, res, next) {
  try {
    const colors = await db.all('SELECT code, name FROM color;');
    res.status(200).json(colors);
  } catch (e) {
    next(e);
  }
}
