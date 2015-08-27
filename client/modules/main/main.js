(function (angular) {
  'use strict';

  angular.module('AFE')

  .controller('MainController', function (Session) {
    var self = this;

    self.user = Session;

  });

})(angular);
