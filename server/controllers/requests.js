/**
* Requests Module
*
* This module is responsible for providing full CRUD on the requests table.
*
* @module controllers/requests
* @requires ../lib/db
* @requires ../lib/tools
*/

import db from '../lib/db';
import tools from '../lib/tools';

// module exports
exports.create = create;
exports.read   = read;
exports.update = update;
exports.delete = del;

// GET /requests/:id?
// gets all requests.  Expects a query string with
// ?status = { 'open', 'closed' }
function read(req, res, next) {
  var sql,
      hasId = (req.params.id !== undefined);

  sql =
    'SELECT r.id, r.projectid, r.date, r.beneficiary, r.explanation, r.signatureA, ' +
      'r.signatureB, r.review, r.status, rd.item, rd.budgetcode, rd.quantity, ' +
      'rd.unit, rd.unitprice, rd.totalprice ' +
    'FROM request r JOIN requestdetail rd ON ' +
      'r.id = rd.requestid';

  if (hasId) {
    sql += ' WHERE r.id = ?;';
  }

  db.async.all(sql, [req.params.id])
  .then(function (rows) {

    if (hasId && !rows.length) {
      return res.status(404).send();
    }

    if (hasId) {
      var request = tools.collect(rows, 'details', [
        'totalprice', 'unitprice', 'unit', 'quantity', 'budgetcode', 'item'
      ]);

      return res.status(200).json(request);
    }

    // in this case, an empty result is a positive result
    // not an error.  No rows is a result.
    res.status(200).json(rows);
  })
  .catch(next)
  .done();
}

// POST /requests
// Expects a request body and request detail lines
function create(req, res, next) {
  var requestStmt,
      detailStmt,
      data = req.body,
      userid = req.session.user.id;

  requestStmt = db.prepare('INSERT INTO request (projectid, date, beneficiary, explanation, status, createdby) VALUES (?, ?, ?, ?, ?, ?);');
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
        res.status(200).json({ id : requestid });
      });
    });
  });

  // finalize request statement
  requestStmt.finalize();
}

// PUT /requests/:id
// TODO
function update(req, res, next) {
  next();
}

// DELETE /requests/:id
function del(req, res, next) {

  db.async.run('DELETE FROM request WHERE id = ?', [req.params.id])
  .then(function () {
    res.status(200).send();
  })
  .catch(next)
  .done();
}
