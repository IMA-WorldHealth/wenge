angular.module('wenge')
.controller('RequestCreateController', RequestCreateController);

RequestCreateController.$inject = [
  '$scope', '$location', 'RequestService', 'ProjectService', 'Session', 'AttachmentService'
];

function RequestCreateController($scope, $location, Requests, Projects, Session, Attachments) {
  var vm = this;

  // bind service data
  vm.user = Session;
  vm.requests = Requests.read();
  vm.projects = Projects.read();
  vm.uploader = Attachments.uploader;

  // creation
  vm.slave = Requests.new();
  vm.total = 0;
  vm.retotal = function () { vm.total = Requests.total(vm.slave); };

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
  function submit(invalid) {

    // alias
    var slave = vm.slave;

    // detect errors on detail rows (set the $error property)
    if (!Requests.valid()) {
      slave.$invalid = true;
      return;
    } else {
      slave.$invalid = false;
    }

    // reject outright if the form controller finds an error
    if (invalid) { return; }

    // if we got past the first two checks, we are able to submit
    // to the server.
    Requests.create(slave)
    .then(function (record) {

      // reset the form to a prestine state (for validation)
      $scope.RequestForm.$setPristine();

      // set up a new record
      vm.slave = Requests.new();

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
