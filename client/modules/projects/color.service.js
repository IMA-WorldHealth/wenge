angular.module('wenge')
.service('ColorService', ColorService);

ColorService.$inject = ['$resource'];

// Loads available colors for project
function ColorService($resource) {
  var service = this;

  service.datasource = $resource('/colors/:id');
  service.read = read;

  // refresh the dataset
  function read() {
    service.colors = service.datasource.query();
    return service.colors;
  }

  return service;
}
