angular.module('wenge')
.service('AttachmentService', ['FileUploader', AttachmentService]);

function AttachmentService(FileUploader) {

  var uploader = new FileUploader({
    url        : '/upload',
    alias      : 'attachment',
    autoUpload : true,
    queueLimit : 5
  });

  uploader.onErrorItem = function(fileItem, response, status, headers) {
    console.info('onErrorItem', fileItem, response, status, headers);
  };
  uploader.onCompleteAll = function() {
    console.info('onCompleteAll');
  };

  return uploader;
}
