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

// GET /colors
exports.getColors = function (req, res, next) {
  'use strict';

  db.all('SELECT code, name FROM color;', function (err, rows) {
    if (err) { return res.status(500).json(err); }
    res.status(200).json(rows);
  });
};
