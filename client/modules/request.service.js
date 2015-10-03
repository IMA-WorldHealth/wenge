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

  // total the amound in the record field
  function total(record) {
    return record.details.reduce(function (total, row) {
      if (!row.quantity || !row.unitprice) { return total; }
      return total + (row.quantity * row.unitprice);
    }, 0);
  }

  return service;
}
