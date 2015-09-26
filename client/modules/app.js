angular.module('wenge', ['ngRoute', 'ngResource', 'ui.bootstrap', 'angularFileUpload'])
.config(RouterConfig)
.factory('AuthInterceptor', AuthInterceptor)
.config(InterceptorConfig)
.run(Application);

/* --------------------------------------------------------- */

InterceptorConfig.$inject = ['$httpProvider'];

function InterceptorConfig($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}

/* --------------------------------------------------------- */

AuthInterceptor.$inject = ['$location', '$q', 'Session'];

function AuthInterceptor($location, $q, Session) {
  return {

    // called on server error
    responseError : function (response) {

      // if the server sends back a 403 "Not Authorized",
      // and the code is ERR_NO_SESSION, we have had a session timeout
      // on the server.  Redirect to login
      if (response.status === 403 && response.data.code === "ERR_NO_SESSION") {
        console.log('[AUTH] No session found!');
        Session.destroy();
        $location.url('/login');
      }

      return $q.reject(response);
    }
  };
}

/* --------------------------------------------------------- */

RouterConfig.$inject = ['$routeProvider', '$locationProvider'];

// configure routes
function RouterConfig($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    controller  : 'MainController as MainCtrl',
    templateUrl : 'modules/main/main.html'
  })
  .when('/login', {
    controller  : 'LoginController as LoginCtrl',
    templateUrl : 'modules/login/login.html'
  })
  .when('/dashboard', {
    controller  : 'DashboardController as DashboardCtrl',
    templateUrl : 'modules/dashboard/dashboard.html'
  })
  .when('/create', {
    controller  : 'RequestController as RequestCtrl',
    templateUrl : 'modules/requests/create.html'
  })
  .when('/requests/:id', {
    controller  : 'ReceiptController as ReceiptCtrl',
    templateUrl : 'modules/requests/receipt.html'
  })
  .when('/users', {
    controller  : 'UserController as UserCtrl',
    templateUrl : 'modules/users/users.html'
  })
  .when('/users/:id', {
    controller  : 'UserDetailsController as DetailsCtrl',
    templateUrl : 'modules/users/details/details.html'
  })
  .when('/recover', {
    controller  : 'RecoveryController as RecoveryCtrl',
    templateUrl : 'modules/users/recovery/recovery.html'
  })
  .when('/projects', {
    controller  : 'ProjectController as ProjectCtrl',
    templateUrl : 'modules/projects/project.html'
  })
  .when('/projects/:id', {
    controller  : 'ProjectDetailsController as DetailsCtrl',
    templateUrl : 'modules/projects/details/details.html'
  })
  .otherwise('/');

  // TODO -- make this work
  // $locationProvider.html5Mode(true);
}

/* --------------------------------------------------------- */

Application.$inject = ['$rootScope', '$location', '$q', 'Session'];

// the application start script
function Application($rootScope, $location, $q, Session) {

  function contains(array, value) { return array.indexOf(value) !== -1; }

  // make sure that the user is authenticated
  $rootScope.$on('$routeChangeStart', function (event, next) {
    var publicRoutes = ['/recover', '/users/account/reset', '/login'],
        route = next.originalPath;

    // NOTE - cannot have a user with id === 0
    if (!Session.id && !contains(publicRoutes, route)) {
      $location.url('/login');
    }

    if (!!Session.id && route === '/login') {
      $location.url('/');
    }
  });
}
