(function (angular) {
  'use strict';

  var app = angular.module('AFE');

  // Managing a session like this is an elegant way to
  // ensure a session exists
  app.service('Session', ['$window', function ($window) {

    var self = this;

    // session persist in the browser's session storage
    var storage = $window.sessionStorage,
        key = 'afe-storage';

    // create a new session
    self.create       = function (data) {
      self.id         = data.id;
      self.role       = data.role;
      self.email      = data.email;
      self.lastactive = new Date(data.lastactive);
      self.username   = data.username;
      storage.setItem(key, JSON.stringify(data));
    };

    // destroy the current session
    self.destroy      = function () {
      self.id         = null;
      self.role       = null;
      self.email      = null;
      self.lastactive = null;
      self.username   = null;
      storage.setItem(key, '{}');
    };

    // loads a session from memory
    self.load = function () {
      try {
        var payload = JSON.parse(storage.getItem(key));
        if (!payload) { return; }
        else { self.create(payload); }
      } catch (e) {}
    };

    // load an old session if it exists
    self.load();
  }]);


  app.factory('AuthService', ['$http', 'Session', function ($http, Session) {
    var service = {};

    // log the user in
    service.login = function (credentials) {
      return $http
        .post('/login', { username : credentials.username, password : credentials.password })
        .then(function (res) {
          Session.create(res.data);
          return res.data;
        });
    };

    // log the user out
    service.logout = function () {
      Session.destroy();
      return $http.get('/logout');
    };

    return service;
  }]);


  app.controller('LoginController', ['$location', 'AuthService', function ($location, AuthService) {
    var self = this;

    self.credentials = {};
    self.error = false;

    self.login = function (credentials) {
      self.error = false;
      AuthService.login(credentials)
      .then(function () {
        $location.url('/');
      })
      .catch(function () {
        self.error = true;
      });
    };

  }]);

  app.controller('ApplicationController', ['$scope', function ($scope) {
    $scope.currentUser = null;
    
    $scope.setCurrentUser = function (user) {
      $scope.currentUser = user;
    };
  }]);

})(angular);
