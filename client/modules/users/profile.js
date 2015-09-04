angular.module('AFE')
.controller('ProfileController', [
  '$routeParams', 'UserService', 'AuthService', 'Session', ProfileController
]);

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
function ProfileController() {
  // TODO
}
