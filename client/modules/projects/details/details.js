angular.module('wenge')
.controller('ProjectDetailsController', DetailsController);

DetailsController.$inject = [
  '$routeParams', 'ProjectService', 'ColorService', '$location',
  'ProjectStateService'
];

/**
* This controller is responsible for updating a project, including adding
* subprojects.
*
* @constructor
* @class DetailsController
*/
function DetailsController($routeParams, Projects, Colors, $location, State) {
  var vm = this,
      id = $routeParams.id;

  vm.project = Projects.read(id);
  vm.colors  = Colors.read();

  vm.update      = update;
  vm.selectColor = selectColor;

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
      State.message('success', 'Successfully updated ' + vm.project.code + '.');
      $location.url('/projects');
    });
  }
}
