// project controller

var db = require('../lib/db');

// GET /projects
exports.getProjects = function (req, res, next) {
  'use strict';

  db.all('SELECT id, code, color FROM project;', function (err, rows) {
    if (err) { return res.status(500).json(err); }
    res.status(200).json(rows);
  });
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
  db.get(sql, req.params.id, function (err, rows) {
    if (err) { return res.status(500).json(err); }
    res.status(200).json(rows);
  });
};

// POST /projects
exports.createProject = function (req, res, next) {
  'use strict';

  var sql, data = req.body,
      userid = req.session.user.id;

  sql = 'INSERT INTO project (code, color, createdby) VALUES (?,?,?)';

  db.run(sql, data.code, data.color, userid)
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

  db.all('SELECT code, name FROM color;', function (err, rows) {
    if (err) { return res.status(500).json(err); }
    res.status(200).json(rows);
  });
};
