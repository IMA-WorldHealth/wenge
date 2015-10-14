angular.module('wenge')
.controller('RecoverController', RecoverController);

RecoverController.$inject = ['$http'];

/**
* Recover Controller
*
* This controller is responsible for the "Recover your Account" page, which lets
* a user send a password reset request to their email address.
*/
function RecoverController($http) {
  var vm = this;

  vm.error = false;
  vm.success = false;
  vm.submit = submit;

  /* ------------------------------------------------------------------------ */

  // submit to the server
  function submit() {
    vm.success = false;
    vm.error = false;

    vm.loading = true;

    $http.post('/users/recover', { email : vm.email })
    .then(function (data) {
      vm.success = true;
    })
    .catch(function (error) {
      console.log('error:', error);
      vm.error = true;
    })
    .finally(function () {
      vm.loading = false;
    });
  }
}
