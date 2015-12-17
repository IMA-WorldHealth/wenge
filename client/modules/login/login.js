angular.module('wenge')
.controller('LoginController', LoginController);

LoginController.$inject = [ '$location', 'AuthService', 'NavigationService' ];

/**
* The view-model for the login page.
*
* @class LoginController
* @constructor
*/
function LoginController($location, AuthService, Nav) {
  var vm = this;

  // make sure the navigation panel is not visible on this page
  Nav.visible = false;

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
