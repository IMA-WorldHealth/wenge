angular.module('wenge')
.controller('ProjectDetailsController', DetailsController);

DetailsController.$inject = [
  '$routeParams', '$http', 'ProjectService', 'ColorService', '$location'
];

/**
* This controller is responsible for updating a project, including adding
* subprojects.
*
* @constructor
* @class DetailsController
*/
function DetailsController($routeParams, $http, Projects, Colors, $location) {
  var vm = this,
      id = $routeParams.id;

  vm.project = Projects.read(id);
  vm.colors  = Colors.read();

  vm.update      = update;
  vm.selectColor = selectColor;
  vm.createSubproject = createSubproject;
  vm.saveSubproject = saveSubproject;
  vm.cancelSubproject = cancelSubproject;
  vm.deleteSubproject = deleteSubproject;

  /* ------------------------------------------------------------------------ */

  // select a color for the project
  function selectColor(color) {
    vm.project.color = color.code;
    vm.project.colorname = color.name;
  }

  // saves the project in the database
  function update(invalid) {

    if (invalid) { return; }

    Projects.update(vm.project)
    .then(function () {
      $location.url('/projects');
    });
  }

  function deleteSubproject(subproject) {
    $http.delete('projects/' + id + '/subprojects/' + subproject.subid)
    .then(function () {

      console.log('deleted');

      // remove the subproject (without need to refresh)
      vm.project.subprojects = vm.project.subprojects.filter(function (sub) {
        return sub.subid !== subproject.subid;
      });
    });
  }

  function createSubproject() {
    vm.subproject = { projectid: id };
  }

  function saveSubproject() {
    $http.post('projects/' + id + '/subprojects', vm.subproject)
    .then(function () {
      vm.subproject = undefined;

      // refresh the project
      Projects.read(id).$promise.then(function (project) {
       vm.project = project;
      });
    });
  }

  function cancelSubproject() {
    vm.subproject = undefined;
  }
}
