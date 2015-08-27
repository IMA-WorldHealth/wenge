(function (angular) {
  'use strict';

  var app = angular.module('AFE', ['ngRoute', 'ngResource', 'ui.bootstrap']);

  // ensure that the user is properly connected
  app.factory('AuthenticationInjectorFactory', ['$rootScope', '$q', function ($rootScope, $q) {
    return {
      responseError : function (response) {
        console.log('Response:', response);
        return $q.reject(response);
      }
    };
  }]);

  // configure routes
  function configRoutes($routeProvider) {
    $routeProvider
    .when('/', {
      controller : 'MainController as MainCtrl',
      templateUrl : 'modules/main/main.html'
    })
    .when('/login', {
      controller : 'LoginController as LoginCtrl',
      templateUrl : 'modules/login/login.html'
    })
    .when('/dashboard', {
      controller : 'DashboardController as DashboardCtrl',
      templateUrl : 'modules/dashboard/dashboard.html'
    })
    .when('/requests/create', {
      controller : 'RequestCreateController as CreateCtrl',
      templateUrl : 'modules/requests/create.html'
    })
    .when('/requests/:id', {
      controller : 'RequestReviewController as ReviewCtrl',
      templateUrl : 'modules/requests/review.html'
    })
    .when('/users/:userid', {
      controller : 'UserController as UserCtrl',
      templateUrl : 'modules/users/users.html'
    })
    .when('/users/:id/profile', {
      controller : 'UserProfileController as ProfileCtrl',
      templateUrl : 'modules/users/profile.html'
    })
    .when('/users/account/recovery', {
      controller : 'RecoveryController as RecoveryCtrl',
      templateUrl: 'modules/users/recovery/recovery.html'
    })
    .when('/projects', {
      controller : 'ProjectController as ProjectCtrl',
      templateUrl : 'modules/projects/project.html'
    })
    .otherwise('/login');
  }

  function configAuth($httpProvider) {
    $httpProvider.interceptors.push(['$injector', function ($injector) {
      return $injector.get('AuthenticationInjectorFactory');
    }
  ]);

  }

  function run($rootScope, $location, Session) {

    function contains(array, value) { return array.indexOf(value) !== -1; }

    // make sure that the user is authenticated
    $rootScope.$on('$routeChangeStart', function (event, next) {
      var publicRoutes = ['/users/account/recovery', '/users/account/reset', '/login'],
          route = next.originalPath;

      // NOTE - cannot have a user with id === 0
      if (!Session.id && !contains(publicRoutes, route)) {
        console.log('Redirecting to public /login', route);
        $location.url('/login');
      }

      if (!!Session.id && route === '/login') {
        console.log('Blocking attempt at accessing login page.');
        $location.url('/');
      }
    });
  }

  // configure and run
  app.config(['$httpProvider', configAuth]);
  app.config(['$routeProvider', configRoutes]);
  app.run(['$rootScope', '$location', 'Session', run]);

})(angular);
