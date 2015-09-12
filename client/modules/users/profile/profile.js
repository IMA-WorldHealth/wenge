angular.module('wenge')
.controller('ProfileController', ProfileController);

ProfileController.$inject = [
  '$routeParams', 'UserService', 'AuthService', 'Session',
];

/**
* The view-model for a single user's profile page.  This controller must allow
* a given user to edit their own profile, but will not allow that user to make
* changes to others profiles.
*
* If the user is viewing another profile that has the database flag "hidden"
* the module will hide all the user's information behind <i>hidden</i> tags.
*
* @class ProfileController
* @constructor
*/
function ProfileController($routeParams, UserService, AuthService, Session) {
  var vm = this;

  vm.user = UserService.read($routeParams.id);
  vm.edittable = function () { return vm.user.id === Session.id; };

  console.log(vm.user);

  /* --------------------------------------------------------------------------- */

}
