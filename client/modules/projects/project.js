
angular.module('AFE')
.service('ProjectService', ['$resource', ProjectService])
.service('ColorService', ['$resource', ColorService])
.controller('ProjectController', ['$window', 'ProjectService', 'ColorService', ProjectController]);

// Loads available colors for projects
function ColorService($resource) {
  var vm = this;

  vm.datasource = $resource('/colors/:id');
  vm.reload = load;

  // refresh the dataset
  function load() {
    vm.colors = vm.datasource.query();
  }

  // automatically load data
  load();

  return vm;
}

// controls CRUD on projects
function ProjectService($resource) {
  var vm = this;

  // the REST datasource
  vm.datasource = $resource('/projects/:id', { id : '@id' }, { 'update' : { 'method' : 'PUT' }});
  vm.reload = load;

  // get a new form
  vm.new = function () { return new vm.datasource(); };

  // CRUD operatins
  vm.add = add;
  vm.remove = remove;
  vm.edit = edit;

  /* ------------------------------------------------------------------------ */

  // refresh the dataset
  function load() {
    vm.projects = vm.datasource.query();
  }

  // add a new project, updating the project collection
  // when the function completes
  function add(project) {
    return project.$save(function (data) {

      // push the new project onto the stack
      vm.projects.push(data);
    });
  }

  // edit an existing project
  function edit(project) {
    return project.$update(project);
  }

  // delete a project
  function remove(project) {
    var promise = project.$remove(function () {

      // get the index of the removed project
      var idx = vm.projects.indexOf(project);
      console.log('Removing:', idx);
      vm.projects.splice(idx, 1);
    });

    return promise.$promise;
  }

  // automatically load data
  load();

  return vm;
}


// View-Model for the project page.
function ProjectController($window, ProjectService, ColorService) {
  var vm = this;

  // manage tab states
  vm.states = { 'overview' : true, 'add' : false, 'edit' : false };

  // bind the datasets
  vm.projects = ProjectService.projects;
  vm.colors = ColorService.colors;

  // bind tab controls
  vm.goTo = goTo;

  // bind functions
  vm.print = $window.print;
  vm.selectColor = selectColor;

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
  function selectColor(color) {
    vm.slave.colorname = color.name;
    vm.slave.color = color.code;
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
    ProjectService.remove(project)
    .then(function () {
    });
  }
}
