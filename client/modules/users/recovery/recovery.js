angular.module('wenge')
.controller('RecoverController', RecoverController);

RecoverController.$inject = ['$http'];

function RecoverController($http) {
  var vm = this;

  vm.error = false;
  vm.success = false;
  vm.submit = submit;
  
  // submit to the server
  function submit() {
    vm.success = false;
    vm.error = false;

    $http.post('/accounts/recover', { email : vm.email })
    .then(function () {
      vm.success = true;
    })
    .catch(function () {
      vm.error = true;
    });
  }
}
