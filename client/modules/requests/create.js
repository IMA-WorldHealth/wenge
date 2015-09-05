angular.module('wenge')
.controller('RequestController', ['$scope', '$location', 'AFEService', 'ProjectService', 'Session', 'AttachmentService', RequestController]);

function RequestController($scope, $location, AFEService, ProjectService, Session, AttachmentService) {
  var vm = this;

  // load the project data
  ProjectService.load();

  // bind service data
  vm.user = Session;
  vm.requests = AFEService.requests;
  vm.projects = ProjectService.projects;
  vm.uploader = AttachmentService;

  // creation
  vm.slave = AFEService.record();
  vm.total = 0;
  vm.retotal = function () { vm.total = AFEService.total(vm.slave); };

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
    if (!AFEService.valid(slave)) {
      slave.$invalid = true;
      return;
    } else {
      slave.$invalid = false;
    }

    // reject outright if the form controller finds an error
    if (invalid) { return; }

    // if we got past the first two checks, we are able to submit
    // to the server.
    AFEService.create(slave)
    .then(function (record) {

      // reset the form to a prestine state (for validation)
      $scope.RequestForm.$setPristine();

      // set up a new record
      vm.slave = AFEService.record();

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
