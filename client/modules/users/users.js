angular.module('wenge')
.controller('UserController', [
  'UserService', 'Session', UserController
]);

/**
* The view-model for the users page.  Downloads a list of users
* for 
*
* @class UserController 
* @constructor
*/
function UserController(UserService, Session) {
  var vm = this;

  // expose data to view
  vm.user = Session;
  vm.users = UserService.read();
}
