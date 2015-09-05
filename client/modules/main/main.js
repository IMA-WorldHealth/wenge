angular.module('wenge')
.controller('MainController', ['Session', MainController]);

function MainController(Session) {
  var vm = this;

  // bind data to view
  vm.user = Session;
  vm.getGreeting = getGreeting;

  var timestamp = new Date(),
      noon = getNoon();

  // get a time at 12 o'clock
  function getNoon() {
    var today = new Date();
    today.setHours(12, 0, 0, 0);
    return today;
  }

  // determin how to greet the user
  function getGreeting() {
    var greeting,
        difference = timestamp.getHours() - noon.getHours();

    // morning
    if (difference < 0) {
      greeting = "Good Morning";
    } else if (difference > 6) {
      greeting = "Good Evening";
    } else {
      greeting = "Good Afternoon";
    }

    return greeting;
  }
}
