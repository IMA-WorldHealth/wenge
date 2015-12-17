angular.module('wenge')
.service('NavigationService', NavigationService);

/**
* Navigation Service
*
* Allows controllers to toggle the state of the navigation bar, particularly
* whether it is visible or not.
*/
function NavigationService() {
  var service = this;

  service.visible = true;

  return service;
}
