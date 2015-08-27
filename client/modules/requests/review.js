(function (angular) {
  'use strict';

  angular.module('AFE')
  .controller('RequestReviewController', ['$http', '$routeParams', function ($http, $routeParams) {

    var self =  this;
    self.id = $routeParams.id;

    console.log('self.id', self.id);

    // TODO
    // load the user by id
    // load the project by name

    // load the correct request for display
    $http.get('/requests/' + self.id)
    .then(function (response) {

      // the response has at least one row.  We can retrieve the metadata
      // from the first row and then display the details in the second.
      self.meta = response.data[0];
      self.data = response.data;

      self.totals = response.data.reduce(function (agg, row) {
        agg.items += row.quantity;
        agg.prices += (row.quantity * row.unitprice);
        return agg;
      }, { items : 0, prices : 0 });

    })
    .catch(function (err) {
      console.error(err);
    });

  }]);
})(angular);
