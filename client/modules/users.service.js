angular.module('AFE')
.service('UserService', ['$resource', UserService]);

function UserService($resource) {
  var vm = this;

  // REST interface
  vm.datasource = $resource('/users/:id', { id : '@id' }, { 'update' : { 'method' : 'PUT' }});
  vm.load = load;
  vm.init = init;
  vm.create = create;
  vm.update = update;
  vm.remove = remove;
  vm.get = get;

  /* ------------------------------------------------------------------------ */

  // populate the users array
  function load() {
    vm.users = vm.datasource.query();
    return vm.users;
  }

  // fetch a single user by id;
  function get(id) {
    return vm.datasource.get({ id : id });
  }

  // create a new user $resource object
  function init() {
    return new vm.datasource();
  }

  // saves a user $resource object
  function create(user) {
    user.$save(function (data) {
      vm.users.push(user);
    });
  }

  // updates a user $resource object
  function update(user) {
    return user.$update(user);
  }

  // DELETE a user on the server and remove
  // the reference from the users array
  function remove(user) {
    return user.$remove(function () {
      var idx = vm.users.indexOf(user);
      vm.users.splice(idx, 1);
    });
  }
}
