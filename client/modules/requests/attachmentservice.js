angular.module('wenge')
.service('AttachmentService', AttachmentService);

AttachmentService.$inject = ['FileUploader'];

function AttachmentService(FileUploader) {
  var service = this;

  service.uploader = new FileUploader({
    url        : '/upload',
    alias      : 'attachment',
    autoUpload : true,
    queueLimit : 5
  });

  service.uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };

  service.uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };

  return service;
}
