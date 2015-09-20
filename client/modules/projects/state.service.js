angular.module('wenge')
.service('ProjectStateService', ProjectStateService);

/**
* Controls the visible states of the project page.
*
* @constructor
* @returns {Object} The project service
*/
function ProjectStateService() {
  'use strict';

  var service = this;

  // toggle message mode - single messages at a time or multiple
  var multi = false;

  // expose service modules
  service.go       = go;
  service.message  = message;
  service.close    = close;
  service.messages = [];
  service.active   = 'overview';
  service.states   = ['overview', 'create', 'update'];

  /* ------------------------------------------------------------------------ */

  // turn on selected state, turning others off
  function go(state) {
    if (service.states.indexOf(state) > -1) { service.active = state; }
  }

  // show an alert message with appropriate type and text
  function message(type, text) {

    // remove previous messages if we are not in multi-message mode
    if (!multi) { service.messages.length = 0; }

    service.messages.push({ type : type, text : text });
  }

  function close(idx) {
    service.messages.splice(idx, 1);
  }
}
