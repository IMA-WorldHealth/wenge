/**
* Projects Controller
*
* This is responsible for all CRUD routes concerning a project.
*/

var db          = require('../lib/db'),
    tools       = require('../lib/tools'),
    subprojects = require('./subprojects');

// module exports
exports.create = create;
exports.read   = read;
exports.update = update;
exports.delete = del;
exports.subprojects = {
  create : subprojects.create,
  read   : subprojects.read,
  update : subprojects.update,
  delete : subprojects.delete
};

// GET projects/:id?
function read(req, res, next) {
  'use strict';

  var sql,
      hasId = (req.params.id !== undefined);

  // if we have a project id, load the project and subprojects
  if (hasId) {
    sql =
      'SELECT p.id, p.code, p.color, s.id AS subid, s.label ' +
      'FROM project AS p LEFT JOIN subproject AS s ON ' +
        'p.id = s.projectid ' +
      'WHERE p.id = ?';

  // if we do no project id, load the project and subprojects
  } else {
    sql =
      'SELECT p.id, p.code, p.color, COUNT(s.id) AS subprojects ' +
      'FROM project AS p LEFT JOIN subproject AS s ON ' +
        'p.id = s.projectid ' +
      'GROUP BY p.id;';
  }

  db.async.all(sql, req.params.id)
  .then(function (rows) {

    if (hasId && !rows.length) {
      return res.status(404).json({});
    }

    // collect the values into a single JSON object
    if (hasId) {
      var project = tools.collect(rows, 'subprojects', ['subid', 'label']);
      return res.status(200).json(project);
    }

    res.status(200).json(rows);
  })
  .catch(next)
  .done();
}

// POST /projects
function create(req, res, next) {
  'use strict';

  var sql, data = req.body,
      userid = req.session.user.id;

  sql = db.prepare('INSERT INTO project (code, color, createdby) VALUES (?,?,?)');

  // TODO -- use async
  sql.run(data.code, data.color, userid, function (err) {

    // server error
    if (err) { return next(err); }

    // send the new project back to the client
    data.id = this.lastID;
    res.status(200).json(data);
  });
}

// PUT /projects/:id
function update(req, res, next) {
  'use strict';

  var sql,
      data = req.body;

  sql =
    'UPDATE project SET code = ?, color = ? WHERE id = ?';

  db.async.run(sql, data.code, data.color, req.params.id)
  .then(function () {
    res.status(200).send();
  })
  .catch(next)
  .done();
}

// DELETE /projects/:id
function del(req, res, next) {
  'use strict';

  var sql =
    'DELETE FROM project WHERE id = ?;';

  db.async.run(sql, req.params.id)
  .then(function () {
    res.status(200).send();
  })
  .catch(next)
  .done();
}

