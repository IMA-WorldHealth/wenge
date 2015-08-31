angular.module('AFE')
.factory('AuthService', ['$http', 'Session', AuthService])
.controller('LoginController', ['$location', 'AuthService', LoginController]);

function AuthService($http, Session) {
  var service = {};

  // log the user in
  service.login = function (credentials) {
    return $http
      .post('/login', { username : credentials.username, password : credentials.password })
      .then(function (res) {
        Session.create(res.data);
        return res.data;
      });
  };

  // log the user out
  service.logout = function () {
    Session.destroy();
    return $http.get('/logout');
  };

  return service;
}


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
