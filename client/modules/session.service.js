angular.module('wenge')
.service('Session', SessionService);

SessionService.$inject = [ '$window' ];

// Managing a session like this is an elegant way to
// ensure a session exists
function SessionService($window) {
  var service = this;

  // session persist in the browser's session storage
  var storage = $window.sessionStorage,
      key = 'wenge-storage';

  // create a new session
  service.create       = function (data) {
    service.id         = data.id;
    service.role       = data.role;
    service.email      = data.email;
    service.lastactive = new Date(data.lastactive);
    service.username   = data.username;
    storage.setItem(key, JSON.stringify(data));
  };

  // destroy the current session
  service.destroy      = function () {
    service.id         = null;
    service.role       = null;
    service.email      = null;
    service.lastactive = null;
    service.username   = null;
    storage.setItem(key, '{}');
  };

  // loads a session from memory
  service.load = function () {
    try {
      var payload = JSON.parse(storage.getItem(key));
      if (!payload) { return; }
      else { service.create(payload); }
    } catch (e) {}
  };

  // load an old session if it exists
  service.load();
}
