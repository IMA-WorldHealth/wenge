angular.module('wenge')
.controller('ProjectController', ProjectController);

ProjectController.$inject = [
  '$window', 'ProjectService', 'ColorService', 'ProjectStateService'
];

// View-Model for the project page.
function ProjectController($window, Projects, Colors, State) {
  var vm = this;

  // bind services to the view, load datasets
  vm.projects = Projects.read();
  vm.colors   = Colors.read();
  vm.state    = State;

  // utility functions
  vm.print = function () { $window.print(); };
  vm.download = angular.noop;
  vm.selectColor = selectColor;
  vm.refresh = Projects.load;

  // edit/add/remove projects
  vm.initAdd  = initAdd;
  vm.saveAdd  = saveAdd;
  vm.initEdit = initEdit;
  vm.saveEdit = saveEdit;
  vm.removeProject = removeProject;

  /* ------------------------------------------------------------------------ */

  // error handler
  function handler(error) {
    State.message('danger', 'Welp! An error occured. Try again?');
  }

  // select a color for the slave project
  function selectColor(project, color) {
    project.colorname = color.name;
    project.color = color.code;
  }

  // initialize the add form
  function initAdd() {
    vm.slave = Projects.new();
    State.go('create');
  }

  // save the new project
  function saveAdd(invalid, project) {

    // make sure form is valid
    if (invalid) { return; }

    Projects.create(project)
    .then(function () {
      State.message('success', 'Successfully created "' + project.code + '"');
      State.go('overview');
    });
  }

  // initialize project editing
  function initEdit(project) {

    // go to the editing mode on this project
    vm.slave = project;

    // get the color name
    vm.colors.forEach(function (color) {
      if (project.color === color.code) {
        project.colorname = color.name;
      }
    });

    // go to the editing tab
    State.go('update');
  }

  // save the edited project
  function saveEdit(invalid, project) {

    // make sure form passes
    if (invalid) { return; }

    Projects.update(project)
    .then(function (project) {
      State.message('info', 'Successfully updated "' + project.code + '".');
      State.go('overview');
    })
    .catch(function (error) {
    });
  }

  // delete a project
  function removeProject(project) {
    Projects.delete(project)
    .then(function () {
      State.message('info', 'You successfully deleted "' + project.code + '".');
    });
  }
}
