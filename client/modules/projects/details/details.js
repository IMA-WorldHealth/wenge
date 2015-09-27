angular.module('wenge')
.controller('ProjectDetailsController', DetailsController);

DetailsController.$inject = [
  '$routeParams', '$http', '$location', '$window', 'ProjectService',
  'ColorService'
];

/**
* This controller is responsible for updating a project, including adding,
* updateing, and removing subprojects.
*
* @constructor
* @class DetailsController
*/
function DetailsController($routeParams, $http, $location, $window, Projects, Colors) {
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

  // removes the subproject from the database
  function deleteSubproject(subproject) {
    var bool =
      $window.confirm('Are you sure you want to delete ' + subproject.label + '?');

    if (bool) {

      $http.delete('projects/' + id + '/subprojects/' + subproject.subid)
      .then(function () {

        // remove the subproject (without need to refresh)
        vm.project.subprojects = vm.project.subprojects.filter(function (sub) {
          return sub.subid !== subproject.subid;
        });
      });
    }
  }

  // create a new working subproject
  function createSubproject() {
    vm.subproject = { projectid: id };
  }

  // save teh subproject to the database
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
