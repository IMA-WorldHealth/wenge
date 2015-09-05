
angular.module('wenge')
.controller('RecoveryController', ['$http', function ($http) {

  // alias this
  var self = this;

  self.error = false;
  self.success = false;
  
  // submit to the server
  self.submit = function () {
    self.success = false;
    self.error = false;

    $http.post('/users/accountrecovery', { email : self.email })
    .then(function () {
      self.success = true;
    })
    .catch(function () {
      self.error = true;
    });
  };

}]);
