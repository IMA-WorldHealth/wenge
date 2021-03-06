angular.module('wenge')
.service('DashboardService', ['$http', function ($http) {

  // get the projects
  this.getProjects = function () {
    return $http.get('/projects');
  };

  // get all PRFs
  this.getRequests = function () {
    return $http.get('/requests');
  };

  // get a specific PRF by it's ID
  this.getRequestById = function (id) {
    return $http.get('/request/' + id);
  };

  // this is a server-sent events stream
  this.getRequestStream = function () {
    // SSE
  };

}]);
