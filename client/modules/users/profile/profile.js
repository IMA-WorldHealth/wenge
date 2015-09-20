angular.module('wenge')
.controller('ProfileController', ProfileController);

ProfileController.$inject = [
  '$routeParams', 'UserService', 'ProjectService', 'AuthService', 'Session'
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
function ProfileController($routeParams, UserService, ProjectService, AuthService, Session) {
  var vm = this;

  // get the user information
  vm.user = UserService.read($routeParams.id);
  vm.projects = ProjectService.read();

  // edit controls
  vm.edit = edit;
  vm.editing = false;
  vm.editable = editable;

  /* --------------------------------------------------------------------------- */

  /* A user profile is editable if:
   *  1) the current user is a super user or
   *  2) the current user is viewing their own profile.
   */
  function editable() {
    return vm.user.id === Session.id ||
      vm.user.role === 'superuser';
  }

  
  /* Toggle editing on the user profile */
  function edit() {
    vm.editing = true;
  }
}
