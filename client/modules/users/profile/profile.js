angular.module('eprf')

/* UserProfileController
 *
 * This controler is responsible for updating the user's
 * profile information.  A user profile contains a cached
 * copy of user preferences.
 *
 */
.controller('UserProfileController', ['$http', '$routeParams', function ($http, $routeParams) {
  var self = this,
    userId = $routeParams.userid;

  // load up the user 
  $http.get('/users/' + id)
  .then(function (response) {
    self.user = response.data; 
  })
  .catch(function (error) {
    console.error(error);
  });

}]);
