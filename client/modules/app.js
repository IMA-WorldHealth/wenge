angular.module('wenge', [
  'ngRoute', 'ngResource', 'ui.bootstrap', 'angularFileUpload',
  'angularUtils.directives.dirPagination'
])
.config(RouterConfig)
.factory('AuthInterceptor', AuthInterceptor)
.config(InterceptorConfig)
.config(CompilerConfig)
.run(Application);

/* --------------------------------------------------------- */

InterceptorConfig.$inject = ['$httpProvider'];

function InterceptorConfig($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
}

/* --------------------------------------------------------- */

CompilerConfig.$inject = ['$compileProvider'];

function CompilerConfig($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
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

  // public routes, accessible without need of signin
  .when('/login', {
    controller  : 'LoginController as LoginCtrl',
    templateUrl : 'modules/login/login.html'
  })
  .when('/accounts/recover', {
    controller  : 'AccountRecoverController as RecoverCtrl',
    templateUrl : 'modules/users/recover/recover.html'
  })
  .when('/accounts/create', {
    controller  : 'AccountCreateController as CreateCtrl',
    templateUrl : 'modules/users/create/create.html'
  })

  // private routes
  .when('/requests', {
    controller : 'RequestController as RequestCtrl',
    templateUrl : 'modules/requests/requests.html'
  })
  .when('/requests/create', {
    controller  : 'RequestCreateController as CreateCtrl',
    templateUrl : 'modules/requests/create.html'
  })
  .when('/requests/:id', {
    controller  : 'RequestReceiptController as ReceiptCtrl',
    templateUrl : 'modules/requests/receipt.html'
  })
  .when('/users', {
    controller  : 'UserController as UserCtrl',
    templateUrl : 'modules/users/users.html'
  })
  .when('/users/invite', {
    controller : 'UserInviteController as InviteCtrl',
    templateUrl : 'modules/users/invite/invite.html'
  })
  .when('/users/:id', {
    controller  : 'UserDetailsController as DetailsCtrl',
    templateUrl : 'modules/users/details/details.html'
  })
  .when('/projects', {
    controller  : 'ProjectController as ProjectCtrl',
    templateUrl : 'modules/projects/project.html'
  })
  .when('/projects/create', {
    controller  : 'ProjectCreateController as CreateCtrl',
    templateUrl : 'modules/projects/create/create.html'
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
    var publicRoutes = ['/accounts/', '/login'],
        route = next.originalPath;

    // NOTE - cannot have a user with id === 0
    // do not let users access private pages without a session
    if (!Session.id && !contains(publicRoutes, route)) {
      $location.url('/login');
    }

    // do not let logged in users access the login page
    if (!!Session.id && route === '/login') {
      $location.url('/');
    }
  });
}
