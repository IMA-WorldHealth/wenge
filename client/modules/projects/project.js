
angular.module('AFE')
.service('ProjectService', ['$resource', ProjectService])
.service('ColorService', ['$resource', ColorService])
.controller('ProjectController', ['ProjectService', 'ColorService', ProjectController]);


function ProjectService($resource) {
  return $resource('/projects/:id');
}

function ColorService($resource) {
  return $resource('/colors/:id');
}


function ProjectController(ProjectService, ColorService) {
  var vm = this;

  // load projects from server
  ProjectService.query(function (data) {
    vm.projects = data;
  });

  // load the colors from the server
  ColorService.query(function (data) {
    console.log('Colors:', data);
    vm.colors = data;
  });

  // init a slave form
  vm.slave = new ProjectService();

  // select a color
  vm.selectColor = function (color) {
    vm.slave.colorname = color.name;
    vm.slave.color = color.code;
  };

  // form submission
  vm.submit = function () {
    console.log('Clicked Submit!');
  };
}
