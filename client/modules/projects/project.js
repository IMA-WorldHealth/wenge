angular.module('wenge')
.controller('ProjectController', ProjectController);

ProjectController.$inject = [
  '$window', 'ProjectService', 'ProjectStateService'
];

/**
* Shows a list of projects with further actions as necessary
*
* @constructor
* @class ProjectController
*/
function ProjectController($window, Projects, Colors, State) {
  var vm = this;

  // bind services to the view, load datasets
  vm.projects = Projects.read();
  vm.state    = State;

  // utility functions
  vm.print = function () { $window.print(); };
  vm.download = angular.noop;
  vm.refresh = Projects.load;
  vm.delete   = del;

  /* ------------------------------------------------------------------------ */

  // delete a project
  function del(project) {
    Projects.delete(project)
    .then(function () {
      State.message('info', 'You successfully deleted "' + project.code + '".');
    });
  }
}
