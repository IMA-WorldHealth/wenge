angular.module('AFE')
.controller('UserController', [
  '$routeParams', 'UserService', 'AuthService', 'Session', UserController
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
function UserController($routeParams, UserService, AuthService, Session) {
  var vm = this;

  // make sure that the user is authorized to view all users
  // if not 'admin', the user should only be able to see their own
  // role
  var authorized = $routeParams.id === Session.id || AuthService.isAdmin(Session);

  if (!authorized) {
    vm.unauthorized = true;
    return;
  }

  vm.users = UserService.read();

  console.log(vm.users);
}
