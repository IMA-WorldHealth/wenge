angular.module('wenge')
.factory('MessageFactory', MessageFactory);

function MessageFactory() {
  var service = {};

  // allows multiple messages to be displayed at the same time
  service.multi = false;

  // array of messages
  service.messages = [];

  // service actions
  service.message = message.bind(service);
  service.close = close.bind(service);

  /* ------------------------------------------------------------------------ */
  
  // sends messages
  function message(type, text) {
    // remove previous messages if we are not in multi-message mode
    if (!this.multi) { this.messages.length = 0; }
    this.messages.push({ type : type, text : text });
  }

  function close(idx) {
    this.messages.splice(idx, 1);
  }
  
  return service;
}
