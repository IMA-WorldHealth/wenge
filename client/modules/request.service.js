angular.module('wenge')
.service('RequestService', RequestService);

RequestService.$inject = [
  '$resource', 'Session'
];

function RequestService($resource, Session) {
  var service = this,
      isDef = angular.isDefined;

  // the REST datasource
  service.datasource = $resource('/requests/:id', { id : '@id' }, {
    'update' : { 'method' : 'PUT' }
  });

  // CRUD operations
  service.create = create;
  service.read   = read;
  service.update = update;
  service.delete = del;
  service.new = _new;

  service.total = total;
  service.valid = valid;

  /* ------------------------------------------------------------------------ */

  // create a new record
  function _new() {
    var request = new service.datasource();
    request.date = new Date();
    request.details = [{}];
    request.attachments = [];
    return request;
  }

  // save the new request into the database
  function create(request) {
    return request.$save(function (data) {
      service.reqeuests.push(data);
    });
  }

  // overloaded read operation
  // If an ID is supplied, returns a single JSON from the database.  Otherwise,
  // fetch the entire table in the client-side memory.
  function read(id) {
    if (id) {
      return service.datasource.get({ id : id });
    }

    service.requests = service.datasource.query();
    return service.requests;
  }

  // TODO -- make this work
  function update(request) {
    return request.$update();
  }

  // TODO -- make this work
  function del(request) {
    return request.$remove();
  }

  // validate that a record is properly formatted
  function valid(record) {
    var invalid, properties;

    // required properties for the record
    properties = ['item', 'budgetcode', 'unit', 'unitprice'];

    // the record must have at least one row
    if (record.details.length < 1) { invalid = true; }

    // loop through the record details, and assert that all required properties
    // are defined on the model.
    record.details.forEach(function (row) {
      var correct = properties.every(function (prop) {
        var value = row[prop];
        return isDef(value) && value !== "" && value !== null;
      });

      // set the $error property if not all properties present
      row.$error = !correct;

      // toggle global error if even one row is not correct
      if (!correct) { invalid = true;}
    });

    return !invalid;
  }

  // total the amound in the record field
  function total(record) {
    return record.details.reduce(function (total, row) {
      if (!row.quantity || !row.unitprice) { return total; }
      return total + (row.quantity * row.unitprice);
    }, 0);
  }

  return service;
}
