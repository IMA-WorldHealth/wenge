angular.module('AFE')
.controller('ReceiptController', ['$http', '$routeParams', '$location',
  'AFEService', 'UserService', 'ProjectService', ReceiptController]);

function ReceiptController($http, $routeParams, $location, Requests, Users, Projects) {
  var id, vm =  this;

  // the id we will search for
  id  = $routeParams.id;

  vm.print = function () { window.print(); };
  vm.link = $location.absUrl();

  // load the particular request
  vm.request = Requests.get(id);
}
