
angular.module('AFE')
.service('RequestService', ['$resource', RequestService])
.controller('RequestController', ['$location', 'RequestService', 'ProjectService', 'Session', RequestController]);

function RequestService($resource) {
  var vm = this;

  vm.datasource = $resource('/requests/:id');
  vm.reload = load;

  // refresh the dataset
  function load() {
    vm.requests = vm.datasource.query();
  }

  return vm;
}


function RequestController($location, RequestService, ProjectService, Session) {
  var vm = this;

  // bind service data
  vm.user = Session;
  vm.requests = RequestService.requests;
  vm.projects = ProjectService.projects;

  // creation
  vm.slave = new RequestService.datasource();
  vm.submit = submit;
  vm.assignProjectId = assignProjectId;
  vm.addRow = addRow;
  vm.removeRow = removeRow;
  vm.totalRows = totalRows;

  // assign temp data
  vm.slave.date = new Date();
  vm.slave.details = [{}];
  vm.noop = angular.noop;

  /* ----------------------------------------------------------------------- */


  // assign the projectId
  function assignProjectId(project) {
    vm.slave.projectid = project.id;
    vm.slave.project = project;
  }

  // TODO/FIXME This validation has many holes
  // ideally, I'd like to inform the user which rows on the
  //
  // submits the form to the server, after validation checks
  function submit(slave) {

    if (validateRows(slave.details)) {

      // remove row error (redo this, please using vm.errors = {};)
      delete slave.rowerror;

      // we need to get the user id
      slave.userid = vm.user.id;

      $http.post('/requests', slave)
      .then(function (response) {

        // on successful submission, go the view mode
        $location.url('/requests/' + response.data.requestid);
      })
      .catch(console.error);
    } else {

      // TODO standardize error reporting
      slave.rowerror = true;
    }
  }

  // validation for table rows
  function validateRows(rows) {
    return rows.every(function (row) {
      return isDef(row.item) &&
        isDef(row.budgetcode) &&
        isDef(row.quantity) &&
        isDef(row.unit) &&
        isDef(row.unitprice);
    });
  }

  // adds a row to the requestdetail line
  function addRow() {
    this.slave.details.push({});
  }

  // removes the row at idx from the requestdetails table
  function removeRow(idx) {
    vm.slave.details.splice(idx, 1);
  }

  // calculates totals for the requestdetails table
  function totalRows() {
    vm.total = vm.slave.details.reduce(function (a, row) {
      if (!row.quantity || !row.unitprice) { return a; }
      return a + (row.quantity * row.unitprice);
    }, 0);
  }
}

