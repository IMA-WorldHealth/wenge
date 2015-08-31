angular.module('AFE')
.service('ColorService', ['$resource', ColorService])
.controller('ProjectController', ['$window', 'ProjectService', 'ColorService', ProjectController]);

// Loads available colors for projects
function ColorService($resource) {
  var vm = this;

  vm.datasource = $resource('/colors/:id');
  vm.load = load;

  // refresh the dataset
  function load() {
    vm.colors = vm.datasource.query();
    return vm.colors;
  }

  return vm;
}


// View-Model for the project page.
function ProjectController($window, ProjectService, ColorService) {
  var vm = this;

  // Load the projects data
  ProjectService.load();

  // manage tab states
  vm.states = { 'overview' : true, 'add' : false, 'edit' : false };
  vm.goTo = goTo;

  // bind the datasets
  vm.projects = ProjectService.load();
  vm.colors = ColorService.load();

  // utility functions
  vm.print = function () { $window.print(); };
  vm.download = angular.noop;
  vm.selectColor = selectColor;
  vm.refresh = ProjectService.load;

  // edit/add/remove projects
  vm.initAdd = initAdd;
  vm.saveAdd = saveAdd;
  vm.initEdit = initEdit;
  vm.saveEdit = saveEdit;
  vm.removeProject = removeProject;

  /* ------------------------------------------------------------------------ */

  // navigate to tab by id, setting it as active
  function goTo(state) {
    for (var s in vm.states) { vm.states[s] = false; }
    vm.states[state] = true;
  }

  // select a color for the slave project
  function selectColor(project, color) {
    project.colorname = color.name;
    project.color = color.code;
  }

  // initialize the add form
  function initAdd() {
    vm.slave = new ProjectService.datasource();
    vm.goTo('add');
  }

  // save the new form
  function saveAdd(invalid, project) {
    if (invalid) { return; }
    ProjectService.add(project)
    .then(function () {
      vm.goTo('overview');
    });
  }

  // initialize project editing
  function initEdit(project) {

    // go to the editting mode on this project
    vm.slave = project;

    // get the color name
    vm.colors.forEach(function (color) {
      if (project.color === color.code) {
        project.colorname = color.name;
      }
    });

    // go to the editting tab
    vm.goTo('edit');
  }

  // save the editted project
  function saveEdit(invalid, project) {
    if (invalid) { return; }
    ProjectService.edit(project)
    .then(function () {
      vm.goTo('overview');
    });
  }

  // delete a project
  function removeProject(project) {
    ProjectService.remove(project);
  }
}
