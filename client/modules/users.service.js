angular.module('wenge')
.service('UserService', UserService);

UserService.$inject = ['$resource'];

/**
* The REST interface for interaction with the backend user
* table.  Implements a full CRUD interace using the appropriate
* HTTP verbs.
*
* @class UserService
* @constructor
*/
function UserService($resource) {
  var vm = this;

  // REST interface
  vm.datasource = $resource('/users/:id', { id : '@id' }, {
    'update' : { 'method' : 'PUT' }
  });

  // CRUD operations
  vm.create = create;
  vm.read = read;
  vm.update = update;
  vm.delete = rm;

  // Special method init to initial a new client-side object
  vm.init = init;

  /* ------------------------------------------------------------------------ */

  /**
  * Writes an instanciated user instance to the backend database.  It is
  * important to note that this method does not create a clientside user object.
  * It is called on a user object instanciated by the init() method to write it
  * to the backend database.
  *
  * @method create
  * @param {Object} user The id of a particular user, not required
  */
  function create(user) {
    user.$save(function (data) {
      vm.users.push(user);
    });
  }

  /**
  * Reads data from the users table.  Will return a single
  * user instance if called with an id, or defaults to the
  * entire users array.
  *
  * @method read
  * @param {Number} [id=undefined] the id of a particular user
  * @return {Object} Returns an array if called without an id,
  * or an object if called with an id
  */
  function read(id) {
    if (angular.isDefined(id)) {
      return vm.datasource.get({ id : id });
    } else {
      vm.users = vm.datasource.query();
      return vm.users;
    }
  }

  /**
  * Initialize a new clientside user object.
  *
  * @method init
  * @return {Object} the new user object
  */
  function init() {
    return new vm.datasource();
  }

  /**
  * Updates the user id in the database via a PUT request.  The end
  *
  * @method
  * @param {Object} user A user instance loaded from the database
  * @return {Object} Returns the updated user object sent from te database
  */
  function update(user) {
    return user.$update(user);
  }

  // DELETE a user on the server and remove
  // the reference from the users array
  /**
  * Deletes the user in the server database and removes
  * the reference from the users array
  *
  * @method delete
  * @param {Object} user A user instance loaded from the database
  */
  function rm(user) {
    return user.$remove(function () {
      var idx = vm.users.indexOf(user);
      vm.users.splice(idx, 1);
    });
  }
}
