angular.module('wenge')
.service('ProjectService', ProjectService);

ProjectService.$inject = ['$resource'];

// controls CRUD on projects
function ProjectService($resource) {
  var service = this;

  // the REST datasource
  service.datasource = $resource('/projects/:id', { id : '@id' }, {
    'update' : { 'method' : 'PUT' }
  });

  // CRUD operatins
  service.create = create;
  service.read   = read;
  service.update = update;
  service.delete = del;
  service.new = function () { return new service.datasource(); };

  /* ------------------------------------------------------------------------ */

  // overloaded read operation
  // if an ID is supplied, read a single value from the database.  Otherwise,
  // fetch the entire table into client-side memory.
  function read(id) {
    if (id) {
      return service.datasource.get({ id : id });
    }
    service.projects = service.datasource.query();
    return service.projects;
  }

  // create a new project, updating the project collection
  // when the function completes
  function create(project) {
    return project.$save(function (data) {

      // push the new project onto the stack
      service.projects.push(data);
    });
  }

  // update an existing project
  function update(project) {
    return project.$update();
  }

  // DELETE a project on the server and remove
  // the project reference from the projects array
  function del(project) {
    return project.$remove(function () {
      var idx = service.projects.indexOf(project);
      service.projects.splice(idx, 1);
    });
  }

  return service;
}
