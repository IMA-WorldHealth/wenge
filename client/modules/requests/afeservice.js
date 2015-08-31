angular.module('AFE')
.service('AFEService', ['$resource', 'Session', AFEService]);

function AFEService($resource, Session) {
  var vm = this,
      isDef = angular.isDefined;

  vm.datasource = $resource('/requests/:id');
  vm.load = load;
  vm.record = record;
  vm.total = total;
  vm.create = create;
  vm.valid = valid;
  vm.get = get;

  /* ----------------------------------------------------------------------- */

  // create a new record, with details and attachments
  function record() {
    var slave = new vm.datasource();
    slave.date = new Date();
    slave.details = [{}];
    slave.attachments = [];
    slave.userid = Session.id;
    return slave;
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

  function create(slave) {
    return slave.$save();
  }

  // total the amound in the record field
  function total(record) {
    return record.details.reduce(function (total, row) {
      if (!row.quantity || !row.unitprice) { return total; }
      return total + (row.quantity * row.unitprice);
    }, 0);
  }

  // refresh the dataset
  function load() {
    vm.requests = vm.datasource.query();
    return vm.requests;
  }

  function get(id) {
    return vm.datasource.get({ id : id });
  }

  return vm;
}
