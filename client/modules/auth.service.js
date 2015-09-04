angular.module('AFE')
.service('AuthService', ['$http', 'Session', AuthService]);

/**
* The authentication and authorization service to facilitate logins and control
* permissions on the client.
*
* @class AuthService
* @constructor
*/
function AuthService($http, Session) {
  var vm = this;

  // log the user in
  vm.login = function (credentials) {
    return $http
      .post('/login', { username : credentials.username, password : credentials.password })
      .then(function (res) {
        Session.create(res.data);
        return res.data;
      });
  };

  // log the user out
  vm.logout = function () {
    Session.destroy();
    return $http.get('/logout');
  };

  /**
  * Checks if a user has admin privileges or greater.
  *
  * @method isAdmin
  * @return {Boolean} Returns true the user has admin privileges or greater
  */
  vm.isAdmin = function (user) {
    return user.role === 'admin' || user.role === 'superuser';
  };

  return vm;
}
