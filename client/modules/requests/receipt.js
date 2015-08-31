angular.module('AFE')
.controller('ReceiptController', ['$http', '$routeParams', '$location', ReceiptController]);

function ReceiptController($http, $routeParams, $location) {
  var vm =  this;

  vm.id = $routeParams.id;
  vm.print = function () { window.print(); };
  vm.link = $location.absUrl();

  // TODO
  // make this a $resource
  // load the user by id
  // load the project by name

  // load the correct request for display
  $http.get('/requests/' + vm.id)
  .then(function (response) {

    // the response has at least one row.  We can retrieve the metadata
    // from the first row and then display the details in the second.
    vm.meta = response.data[0];
    vm.data = response.data;

    vm.totals = response.data.reduce(function (agg, row) {
      agg.items += row.quantity;
      agg.prices += (row.quantity * row.unitprice);
      return agg;
    }, { items : 0, prices : 0 });

  })
  .catch(function (err) {
    console.error(err);
  });
}
