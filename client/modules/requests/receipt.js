angular.module('AFE')
.controller('ReceiptController', ['$scope', '$routeParams', '$location',
  'AFEService', 'UserService', 'ProjectService', ReceiptController]);

function ReceiptController($scope, $routeParams, $location, Requests, Users, Projects) {
  var id, vm =  this;

  // the id we will search for
  id  = $routeParams.id;

  vm.print = function () { window.print(); };
  vm.link = $location.absUrl();

  // load the particular request
  $scope.receipt = vm.receipt = Requests.get(id);

  // TODO - is there a better way?
  // On receipt load, load projects and users
  $scope.$watch('receipt', function () {
    vm.user = Users.get(vm.receipt.userid);
    vm.project = Projects.get(vm.receipt.projectid);
  });

}
