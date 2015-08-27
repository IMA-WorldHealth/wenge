angular.module('AFE')

.controller('NavigationController', ['AuthService', 'Session', '$location', function (AuthService, Session, $location) {
  this.isLoggedIn = function () {
    return Session.id;
  };

  this.user = Session;

  this.logout = function () {
    console.log('clicked logout');
    AuthService.logout()
    .then(function () {
      $location.url('/login');
    });
  };
}]);
