angular.module('AFE')
.controller('UserController', [
  'UserService', 'AuthService', 'Session', UserController
]);

/**
* The view-model for the users page.  Downloads a list of users
* for 
*
* @class UserController 
* @constructor
*/
function UserController(UserService, AuthService, Session) {
  var vm = this;

  // cache the user id if we need it
  vm.user = Session;
  vm.users = UserService.read();

  console.log(vm.users);
}
