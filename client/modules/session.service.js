angular.module('AFE')
.service('Session', ['$window', SessionService]);

// Managing a session like this is an elegant way to
// ensure a session exists
function SessionService($window) {
  var vm = this;

  // session persist in the browser's session storage
  var storage = $window.sessionStorage,
      key = 'afe-storage';

  // create a new session
  vm.create       = function (data) {
    vm.id         = data.id;
    vm.role       = data.role;
    vm.email      = data.email;
    vm.lastactive = new Date(data.lastactive);
    vm.username   = data.username;
    storage.setItem(key, JSON.stringify(data));
  };

  // destroy the current session
  vm.destroy      = function () {
    vm.id         = null;
    vm.role       = null;
    vm.email      = null;
    vm.lastactive = null;
    vm.username   = null;
    storage.setItem(key, '{}');
  };

  // loads a session from memory
  vm.load = function () {
    try {
      var payload = JSON.parse(storage.getItem(key));
      if (!payload) { return; }
      else { vm.create(payload); }
    } catch (e) {}
  };

  // load an old session if it exists
  vm.load();
}
