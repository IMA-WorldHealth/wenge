angular.module('AFE')
.service('ProjectService', ['$resource', ProjectService]);

// controls CRUD on projects
function ProjectService($resource) {
  var vm = this;

  // the REST datasource
  vm.datasource = $resource('/projects/:id', { id : '@id' }, { 'update' : { 'method' : 'PUT' }});
  vm.load = load;

  // get a new form
  vm.new = function () { return new vm.datasource(); };

  // CRUD operatins
  vm.add = add;
  vm.remove = remove;
  vm.edit = edit;
  vm.get = get;

  /* ------------------------------------------------------------------------ */

  // refresh the dataset
  function load() {
    vm.projects = vm.datasource.query();
    return vm.projects;
  }

  // add a new project, updating the project collection
  // when the function completes
  function add(project) {
    return project.$save(function (data) {

      // push the new project onto the stack
      vm.projects.push(data);
    });
  }

  // fetch a single project
  function get(id) {
    return vm.datasource.get({ id : id });
  }

  // edit an existing project
  function edit(project) {
    return project.$update(project);
  }

  // DELETE a project on the server and remove
  // the project reference from the projects array
  function remove(project) {
    return project.$remove(function () {
      var idx = vm.projects.indexOf(project);
      vm.projects.splice(idx, 1);
    });
  }

  return vm;
}
