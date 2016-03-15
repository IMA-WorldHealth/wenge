/**
* Projects Controller
*
* This is responsible for implementing CRUD operations on the projects database
* table.
*
* CRUD Design Guidelines, inspired by koa.
*  - GET /resource -> module.index()
*  - GET /resource/:id -> module.read()
*  - POST /resource -> module.create()
*  - PUT /resource -> module.update()
*  - DELETE /resource -> module.delete()
*
* @module controllers/projects
*
* @requires ../lib/db
* @requires ../lib/tools
* @requires ./subprojects
*/

import db from '../lib/db';
import tools from '../lib/tools';
import subprojects from './subprojects';
import { NotFound } from '../lib/errors';

// GET /projects
export async function index(req, res, next) {
  const sql =
    `SELECT p.id, p.code, p.color, COUNT(s.id) AS subprojects
     FROM project AS p LEFT JOIN subproject AS s ON
       p.id = s.projectid
     GROUP BY p.id;`;

  try {
    const rows = await db.all(sql, req.params.id);
    res.status(200).json(rows);
  } catch (e) { next(e); }
}


// GET /projects/:id
export async function read(req, res, next) {
  const id = req.params.id;
  const sql =
    `SELECT p.id, p.code, p.color, s.id AS subid, s.label
    FROM project AS p LEFT JOIN subproject AS s ON
      p.id = s.projectid
    WHERE p.id = ?`;

  try {
    const row = await db.get(sql, req.params.id);

    if (!row) {
      throw new NotFound(`Could not find a project with id ${id}`);
    }

    /** @todo -- finish this! */
    const project = tools.collect(row, 'subprojects', ['subid', 'label']);
    res.status(200).json(project);
  } catch (e) { next(e); }
}


// POST /projects
export async function create(req, res, next) {
  const data = req.body;
  const id = req.session.user.id;
  const sql = 'INSERT INTO project (code, color, createdby) VALUES (?,?,?);';

  try {
    await db.run(sql, data.code, data.color, id);

    // send the new project back to the client
    res.status(200).json({ id: this.lastId });
  } catch (e) { next(e); }
}

// PUT /projects/:id
export async function update(req, res, next) {
  const data = req.body;
  const sql = 'UPDATE project SET code = ?, color = ? WHERE id = ?';

  try {
    await db.run(sql, data.code, data.color, req.params.id);
    res.sendStatus(200);
  } catch (e) { next(e); }
}

// DELETE /projects/:id
async function del(req, res, next) {
  const sql = 'DELETE FROM project WHERE id = ?;';

  try {
    await db.run(sql, req.params.id);
    res.sendStatus(200);
  } catch (e) { next(e); }
}

export { del as delete };
