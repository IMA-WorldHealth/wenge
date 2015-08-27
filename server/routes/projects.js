// project controller

var db = require('../lib/db');

// GET /projects
exports.getProjects = function (req, res, next) {
  'use strict';

  db.async.all('SELECT id, code, color FROM project;')
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
};

// GET projects/:id
exports.getProjectById = function (req, res, next) {
  'use strict';

  var sql =
    'SELECT p.id, p.code, p.color, s.id AS subid, s.label ' +
    'FROM project AS p JOIN subproject AS s ON p.id = s.projectid ' +
    'WHERE p.id = ?';

  // TODO - return a nice tree structure in this format:
  // { id : xxx, code : xxx, color : xxx, subprojects : [ { id: xxx, label : xxx }, {..}] }
  db.async.get(sql, req.params.id)
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
};

// POST /projects
exports.createProject = function (req, res, next) {
  'use strict';

  var sql, data = req.body,
      userid = req.session.user.id;

  sql = 'INSERT INTO project (code, color, createdby) VALUES (?,?,?)';

  db.async.run(sql, data.code, data.color, userid)
  .then(function () {
    var id =  this.lastID;
    res.status(200).json({ id : id });
  })
  .catch(next)
  .done();
};

// GET /colors
exports.getColors = function (req, res, next) {
  'use strict';

  db.asyc.all('SELECT code, name FROM color;')
  .then(function (rows) {
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
};
