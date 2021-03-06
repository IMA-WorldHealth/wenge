angular.module('wenge')
.directive('wengeNavigation', wengeNavigation);

function wengeNavigation() {
  return {
    restrict : 'E',
    scope : {},
    templateUrl : 'modules/navigation/navigation.html',
    controller : 'NavigationController',
    controllerAs : 'NavCtrl',
    bindToController : true
  };
}


angular.module('wenge')
.controller('NavigationController', NavigationController);

NavigationController.$inject = ['AuthService', 'Session', '$location', 'NavigationService'];

/**
* NavigationControlller
*
* Bound to the above navigation directive.
*/
function NavigationController(AuthService, Session, $location, NavService) {
  var vm = this;

  // expose to the view model
  vm.user = Session;
  vm.service = NavService;
  vm.logout = logout;
  vm.links = [{
    icon : 'diff',
    url : 'requests/create',
    title : 'Requests'
  }, {
    icon : 'repo',
    url: 'projects',
    title : 'Projects'
  }, {
    icon : 'organization',
    url : 'users',
    title : 'Users'
  }, {
    icon : 'circuit-board',
    url : 'settings',
    title : 'Settings'
  }];


  // logs the current user out
  function logout() {
    AuthService.logout()
    .then(function () {
      $location.url('/login');
    });
  }
}
