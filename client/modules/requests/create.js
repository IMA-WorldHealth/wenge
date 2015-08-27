(function (angular) {
  'use strict';

  angular.module('AFE')
  .controller('RequestCreateController', ['$http', '$location', 'Session', function ($http, $location, Session) {

    var self = this,
        isDef = angular.isDefined;

    self.slave = {
      details : [{}, {}],
      date : new Date()
    };

    // load projects
    $http.get('/projects')
    .success(function (data) {
      self.projects = data;
      console.log('project', data);
    })
    .error(console.error);

    // pretty formatting for the projects dropdown
    this.fmtProjects = function (project) {
      return project ? project.id + ' - ' + project.code : '';
    };

    self.user = Session;

    // TODO/FIXME This validation has many holes
    // ideally, I'd like to inform the user which rows on the
    //
    // submits the form to the server, after validation checks
    this.submit = function (slave) {

      if (validateRows(slave.details)) {

        // remove row error (redo this, please using self.errors = {};)
        delete slave.rowerror;

        // we need to get the user id
        slave.userid = self.user.id;

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
    };

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
    this.addRow = function () {
      this.slave.details.push({});
    };

    // removes the row at idx from the requestdetails table
    this.removeRow = function (idx) {
      self.slave.details.splice(idx, 1);
    };

    // calculates totats for the requestdetails table
    this.totalRows = function () {
      self.total = self.slave.details.reduce(function (a, row) {
        if (!row.quantity || !row.unitprice) { return a; }
        return a + (row.quantity * row.unitprice);
      }, 0);
    };

  }]);

})(angular);
