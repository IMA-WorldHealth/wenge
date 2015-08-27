
angular.module('AFE')
.service('ProjectService', ['$resource', ProjectService])
.controller('ProjectController', ['ProjectService', ProjectController]);

function ProjectService($resource) {
  return $resource('/projects/:id');
}

function ProjectController(ProjectService) {
  var vm = this;

  // load projects from server
  ProjectService.query(function (response) {
    console.log('response', response);
    vm.projects = response.data;
  });
}
