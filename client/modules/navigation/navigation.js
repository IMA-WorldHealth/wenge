angular.module('wenge')
.controller('NavigationController', NavigationController);

NavigationController.$inject = ['AuthService', 'Session', '$location'];

function NavigationController(AuthService, Session, $location) {
  var vm = this;

  // expose to the view model
  vm.user = Session;
  vm.logout = logout;
  vm.links = [{
    icon : 'diff',
    url : 'create',
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
