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
function ProjectController($window, Projects, State) {
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

    var bool =
      $window.confirm('Are you sure you want to delete ' + project.code + '?');

    if (bool) {
      Projects.delete(project)
      .then(function () {
        State.message('info', 'Successfully deleted "' + project.code + '".');
      });
    }
  }
}
