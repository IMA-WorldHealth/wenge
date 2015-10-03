angular.module('wenge')
.controller('RequestCreateController', RequestCreateController);

RequestCreateController.$inject = [
  '$location', 'RequestService', 'ProjectService', 'Session', 'AttachmentService'
];

/**
* This controller is responsible for creating requests for expenses.  It
* provides some initial form validation and allows to user to upload attachments
* if the request is two detailed.
*
* @class RequestCreateController
* @constructor
*/
function RequestCreateController($location, Requests, Projects, Session, Attachments) {
  var vm = this;

  // bind service data
  vm.user = Session;
  vm.requests = Requests.read();
  vm.projects = Projects.read();
  vm.uploader = Attachments.uploader;

  // creation
  vm.request = Requests.new();
  vm.total = 0;
  vm.retotal = function () { vm.total = Requests.total(vm.request); };

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
    vm.request.projectid = project.id;
    vm.request.project = project;
  }

  // submits the form to the server, after validation checks
  function submit(invalid) {

    if (vm.request.details.length < 1) {
      
    }


    // reject outright if the form controller finds an error
    if (invalid) { return; }

    // if we got past the first two checks, we are able to submit
    // to the server.
    Requests.create(vm.request)
    .then(function (record) {

      console.log('Server sent back:', record);

      // set up a new record
      vm.request = Requests.new();

      // assign the newly posted record here
      vm.posted = record;
    });
  }

  // adds a row to the requestdetail line
  function addRow() {
    vm.request.details.push({});
  }

  // removes the row at idx from the requestdetails table
  function removeRow(idx) {
    vm.request.details.splice(idx, 1);
  }

  // allow a user to attach a file
  function attachment() {
    var id = 1;
    vm.request.attachments.push(id);
  }
}
