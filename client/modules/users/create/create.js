angular.module('wenge')
.controller('AccountCreateController', AccountCreateController);

AccountCreateController.$inject = [ '$http', 'NavigationService' ];

function AccountCreateController($http, Nav) {
  var vm = this;

  // make sure the nav is invisible on this page.
  Nav.visible = false;

  // bind variables
  vm.form = {};
  vm.matching = false;  // do the passwords match?

  // bind methods
  vm.checkMatching = checkMatching;
  vm.submit = submit;

  /* ------------------------------------------------------------------------ */

  // ensure passwords match
  function checkMatching() {
    if (!vm.form.password || !vm.form.confirmPassword) {
      vm.matching = false;
    } else {
      vm.matching = vm.form.password === vm.form.confirmPassword;
    }
  }

  // submit the form
  function submit(invalid) {
    if (invalid || !vm.matching) { return; }

    console.log('Form appears valid!');
  }
}
