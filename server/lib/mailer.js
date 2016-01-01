/**
* Mailer
*
* A convenient wrapper around mailgun-js.  Automatically inserts the applciation
* email address, and wraps everything in promises.
*
* It also performs any necessary templating on the html property using the keys
* in params.
*/

var composer = require('mailcomposer'),
    mailgun  = require('mailgun-js')({
      apiKey : process.env.MAILGUN_KEY,
      domain : process.env.MAILGUN_DOMAIN
    }),
    tmpl     = require('blueimp-tmpl').tmpl,
    q        = require('q');

exports.send = send;

function send(address, data) {
  'use strict';

  var dfd = q.defer();

  data.from = process.env.APP + '@' + process.env.MAILGUN_DOMAIN;
  data.to = address;

  // template in the parameters before configurting MIME type
  data.html = tmpl(data.html, data.params);

  composer(data).build(function (error, message) {

    if (error) { return dfd.reject(error); }

    var msg = {
      to : address,
      message : message.toString('ascii')
    };

    mailgun.messages().sendMime(msg, function (error, body) {
      if (error) { return dfd.reject(error); }
      dfd.resolve(body);
    });
  });

  return dfd.promise;
}
