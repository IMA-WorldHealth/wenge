angular.module('AFE')
.service('RequestService', ['$resource', 'Session', RequestService])
.service('TemplateService', [TemplateService])
.controller('RequestController', ['$scope', '$location', 'RequestService', 'ProjectService', 'Session', RequestController]);

function RequestService($resource, Session) {
  var vm = this,
      isDef = angular.isDefined;

  vm.datasource = $resource('/requests/:id');
  vm.reload = load;
  vm.record = record;
  vm.total = total;
  vm.create = create;
  vm.valid = valid;

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
  function load() { vm.requests = vm.datasource.query(); }

  return vm;
}

function TemplateService() {
  // TODO
}


function RequestController($scope, $location, RequestService, ProjectService, Session) {
  var vm = this;

  // load the project data
  ProjectService.load();

  // bind service data
  vm.user = Session;
  vm.requests = RequestService.requests;
  vm.projects = ProjectService.projects;

  // creation
  vm.slave = RequestService.record();
  vm.total = 0;
  vm.retotal = function () { vm.total = RequestService.total(vm.slave); };

  // form mechanics
  vm.submit = submit;
  vm.assignProjectId = assignProjectId;
  vm.addRow = addRow;
  vm.removeRow = removeRow;
  vm.attachment = attachment;

  // assign temp data
  vm.noop = angular.noop; // FIXME/TODO

  /* ----------------------------------------------------------------------- */


  // assign the projectId
  function assignProjectId(project) {
    vm.slave.projectid = project.id;
    vm.slave.project = project;
  }

  // submits the form to the server, after validation checks
  function submit(invalid, slave) {

    // detect errors on detail rows (set the $error property)
    if (!RequestService.valid(slave)) {
      slave.$invalid = true;
      return;
    } else {
      slave.$invalid = false;
    }

    // reject outright if the form controller finds an error
    if (invalid) { return; }

    // if we got past the first two checks, we are able to submit
    // to the server.
    RequestService.create(slave)
    .then(function (record) {

      // reset the form to a prestine state (for validation)
      $scope.RequestForm.$setPristine();

      // set up a new record
      vm.slave = RequestService.record();

      // assign the newly posted record here
      vm.posted = record;
    });
  }

  // adds a row to the requestdetail line
  function addRow() {
    vm.slave.details.push({});
  }

  // removes the row at idx from the requestdetails table
  function removeRow(idx) {
    vm.slave.details.splice(idx, 1);
  }

  // allow a user to attach a file
  function attachment() {
    var id = 1;
    vm.slave.attachments.push(id);
  }
}
