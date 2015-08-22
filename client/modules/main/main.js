(function (angular) {
  'use strict';

  angular.module('eprf')

  .controller('MainController', function (Session) {
    var self = this;

    self.user = Session;

  });

})(angular);
