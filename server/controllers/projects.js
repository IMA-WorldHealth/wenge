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
* @requires lib/db
* @requires lib/errors
* @requires ./subprojects
*/

import db from '../lib/db';
import subprojects from './subprojects';
import { NotFound } from '../lib/errors';

// get a project by it's id.
async function getProject(id) {
  let sql = 'SELECT p.id, p.code, p.color FROM project AS p WHERE p.id = ?;';

  const project = await db.get(sql, id);

  if (!project) {
    throw new NotFound(`Could not find a project with id ${id}`);
  }

  // query the subproject table
  sql = 'SELECT id, projectid, label, timestamp FROM subproject WHERE projectid = ?;';

  project.subprojects = await db.all(sql, id);

  return project;
}

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
  try {
    const project = await getProject(req.params.id);
    res.status(200).json(project);
  } catch (e) { next(e); }
}


// POST /projects
export async function create(req, res, next) {
  const data = req.body;
  const sql = 'INSERT INTO project (code, color, createdby) VALUES (?,?,?);';

  try {
    const uid = req.session.user.id;

    await db.run(sql, data.code, data.color, uid);
    const id = await db.get('SELECT last_insert_rowid();');

    // send the new project back to the client
    res.status(201).json({ id });
  } catch (e) { next(e); }
}

// PUT /projects/:id
export async function update(req, res, next) {
  const data = req.body;
  const sql = 'UPDATE project SET code = ?, color = ? WHERE id = ?';

  try {
    await db.run(sql, data.code, data.color, req.params.id);
    const project = await getProject(req.params.id);
    res.status(200).json(project);
  } catch (e) { next(e); }
}

// DELETE /projects/:id
async function del(req, res, next) {
  const sql = 'DELETE FROM project WHERE id = ?;';

  try {
    await db.run(sql, req.params.id);
    res.sendStatus(204);
  } catch (e) { next(e); }
}

export { del as delete };
