var db = require('../lib/db');

// GET /requests?status=open
// gets all requests.  Expects a query string with
// ?status = { 'open', 'closed' }
exports.getRequests = function (req, res, next) {
  'use strict';

  var sql =
    'SELECT r.id, r.projectid, r.date, r.beneficiary, r.explanation, r.signatureA, ' +
      'r.signatureB, r.review, rd.item, rd.budgetcode, rd.quantity, rd.unit, ' +
      'rd.unitprice, rd.totalprice, r.status ' +
    'FROM request r JOIN requestdetail rd ON r.id = rd.requestid;';

  db.all(sql, function (err, rows) {

    // server error
    if (err) { return res.status(500).json(err); }

    // in this case, an empty result is a positive result
    // not an error.  No rows is a result.
    res.status(200).json(rows);
  });
};

// POST /requests
// Expects a request body and request detail lines
exports.createRequests = function (req, res, next) {
  'use strict';

  var requestStmt, detailStmt,
      data = req.body,
      userid = req.session.user.id;

  requestStmt = db.prepare('INSERT INTO request (projectid, date, beneficiary, explanation, status, userid) VALUES (?, ?, ?, ?, ?, ?);');
  detailStmt = db.prepare('INSERT INTO requestdetail (requestid, item, budgetcode, quantity, unit, unitprice, totalprice) VALUES (?, ?, ?, ?, ?, ?, ?);');

  // execute requests one at a time (synchronously)
  db.serialize(function () {

    requestStmt.run(data.projectid, data.date, data.beneficiary, data.explanation, 'open', userid, function (err) {
      if (err) { return next(err); }

      var requestid = this.lastID;

      req.body.details.forEach(function (row) {
        detailStmt.run(requestid, row.item, row.budgetcode, row.quantity, row.unit, row.unitprice, row.unitprice * row.quanity, function (err) {
          if (err) { return next(err); }
        });
      });

      // finalize detail statement
      detailStmt.finalize(function (err) {
        if (err) { return next(err); }

        // everything is good, send back the id for receipt rendering
        res.status(200).json({ requestid : requestid });
      });
    });

  });

  // finalize request statement
  requestStmt.finalize();

};

// GET /requests/:id
exports.getRequestsById = function (req, res, next) {
  'use strict';

  var sql =
    'SELECT r.id, r.projectid, r.date, r.beneficiary, r.explanation, r.signatureA, ' +
      'r.signatureB, r.review, rd.item, rd.budgetcode, rd.quantity, rd.unit, ' +
      'rd.unitprice, rd.totalprice, r.status, r.userid ' +
    'FROM request r JOIN requestdetail rd ON r.id = rd.requestid ' +
    'WHERE r.id = ?;';

  db.all(sql, [req.params.id], function (err, rows) {

    // server error
    if (err) { return next(err); }

    // no data (NOT FOUND)
    if (!rows) { return res.status(404).json(); }

    // success
    res.status(200).json(rows);
  });
};

// PUT /requests/:id
// TODO
exports.updateRequests = function (req, res, next) {
  'use strict';
};

// DELETE /requests/:id
// TODO - 404 vs 200
exports.deleteRequests = function (req, res, next) {
  'use strict';

  db.run('DELETE FROM request WHERE id = ?', [req.params.id], function (err) {
    if (err) { return next(err); }
    res.status(200).send();
  });
};
