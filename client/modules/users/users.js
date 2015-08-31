angular.module('AFE')
.controller('UserController', ['$routeParams', 'UserService', 'Session', UserController]);

function UserController($routeParams, UserService, Session) {
  var vm = this;

  // make sure that the user is authorized to view all users
  // if not 'admin', the user should only be able to see their own
  // role
  var authorized = $routeParams.id === Session.id || Session.role === 'admin';
  if (!authorized) {
    vm.unauthorized = true;
    return;
  }

  vm.users = UserService.load();

  console.log(vm.users);
}
