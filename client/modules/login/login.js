angular.module('wenge')
.controller('LoginController', ['$location', 'AuthService', LoginController]);

/**
* The view-model for the login page.
*
* @class LoginController
* @constructor
*/
function LoginController($location, AuthService) {
  var vm = this;

  vm.credentials = {};
  vm.error = false;

  vm.login = function (credentials) {
    vm.error = false;
    AuthService.login(credentials)
    .then(function () {
      $location.url('/');
    })
    .catch(function () {
      vm.error = true;
    });
  };
}
