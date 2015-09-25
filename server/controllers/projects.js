/**
* Projects Controller
*
* This is responsible for all CRUD routes concerning a project.
*/

var db = require('../lib/db');

// module exports
exports.getProjects    = getProjects;
exports.getProjectById = getProjectById;
exports.createProject  = createProject;
exports.updateProject  = updateProject;
exports.deleteProject  = deleteProject;

// GET /projects
function getProjects(req, res, next) {
  'use strict';

  db.async.all('SELECT id, code, color FROM project;')
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
}

// GET projects/:id
function getProjectById(req, res, next) {
  'use strict';

  var sql =
    'SELECT p.id, p.code, p.color, s.id AS subid, s.label ' +
    'FROM project AS p JOIN subproject AS s ON p.id = s.projectid ' +
    'WHERE p.id = ?';

  // TODO - return a nice tree structure in this format:
  // { id : xxx, code : xxx, color : xxx, subprojects : [ { id: xxx, label : xxx }, {..}] }
  db.async.get(sql, req.params.id)
  .then(function (row) {
    res.status(200).json(row);
  })
  .catch(next)
  .done();
}

// POST /projects
function createProject(req, res, next) {
  'use strict';

  var sql, data = req.body,
      userid = req.session.user.id;

  sql = db.prepare('INSERT INTO project (code, color, createdby) VALUES (?,?,?)');

  sql.run(data.code, data.color, userid, function (err) {
   
    // server error
    if (err) { return next(err); }

    // send the new project back to the client 
    data.id = this.lastID;
    res.status(200).json(data);
  });
}

// PUT /projects/:id
function updateProject(req, res, next) {
  'use strict';

  var sql, data = req.body;

  sql = 'UPDATE project SET code = ?, color = ? WHERE id = ?';

  db.async.run(sql, data.code, data.color, req.params.id)
  .then(function () {
    res.status(200).json(data);
  })
  .catch(next)
  .done();
}

// DELETE /projects/:id
function deleteProject(req, res, next) {
  'use strict';

  var sql =
    'DELETE FROM project WHERE id = ?;';

  db.async.run(sql, req.params.id)
  .then(function () {
    res.status(200).json();
  })
  .catch(next)
  .done();
}
