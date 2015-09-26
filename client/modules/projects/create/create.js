angular.module('wenge')
.controller('ProjectCreateController', CreateController);

CreateController.$inject = [
  'ProjectService', 'ColorService', '$location',
];

/**
* Creates a new project in the database.
*
* @constructor
* @class CreateController
*/
function CreateController(Projects, Colors, $location) {
  var vm = this;

  // initiaze a new project
  vm.project = Projects.new();
  vm.colors  = Colors.read();

  vm.create      = create;
  vm.selectColor = selectColor;

  /* ------------------------------------------------------------------------ */

  // select a color for the project
  function selectColor(color) {
    vm.project.color = color.code;
    vm.project.colorname = color.name;
  }

  // saves the new project in the database
  function create(invalid) {

    if (invalid) { return; }

    Projects.create(vm.project)
    .then(function () {
      $location.url('/projects');
    });
  }
}
