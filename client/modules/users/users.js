angular.module('AFE')
.controller('UserController', [
  'UserService', 'AuthService', 'Session', UserController
]);

/**
* The view-model for the users page.  This controller must take special care
* that only authorized users are allowed to access it.  A user with admin
* privileges or greater can access the entire user list and make abitrary
* changes.  For less priveleged users, they can only make edits to their own
* profiles
*
* @class UserController 
* @constructor
*/
function UserController(UserService, AuthService, Session) {
  var vm = this;

  // cache the user id if we need it
  vm.user = Session;

  vm.users = UserService.read();
}
