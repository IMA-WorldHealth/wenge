/**
* Mailer
*
* A convenient wrapper around mailgun-js.  Automatically inserts the application
* email address, and wraps everything in promises.
*
* @requires lodash
* @requires mailgun
* @requires composer
* @requires bluebird
*/

/** load dependencies */
const path     = require('path');
const fs       = require('fs');
const composer = require('mailcomposer');
const _        = require('lodash');
const P        = require('bluebird');
const mailgun  = require('mailgun-js')({
  apiKey : process.env.MAILGUN_KEY,
  domain : process.env.MAILGUN_DOMAIN
});

/** emails templates */
const templates = {
  recover: fs.readFileSync(path.join(__dirname, '../emails/recover.html'), 'utf8'),
  invite:  fs.readFileSync(path.join(__dirname, '../emails/invitation.html'), 'utf8')
};

/** expose module functionality */
module.exports = send;

/**
 * Sends emails to a recipient, templating in any required data before doing so.
 *
 * @param {string} key - the email key to send.
 * @param {string} address - the recipient's email address
 * @param {object} params - any parameters to be templated into the emails
 *
 * @returns {Promise} promise - resolved if email is successfully send
 */
function send(key, address, params) {
  'use strict';


  data.from = `${ process.env.APP }@${ process.env.MAILGUN_DOMAIN }`;
  data.to = address;

  // template in the parameters before configurting MIME type
  data.html = _.template(templates[key], params);

  return new P(function (resolve, reject) {

    // compose 
    composer(data)
    .build(function (error, message) {

      if (error) {
        return reject(error);
      }

      // prepare the message object for sending
      var message = {
        to:      address,
        message: message.toString('ascii')
      };

      // send an HTML email through mailgun's API
      mailgun.messages()
      .sendMime(message, function (error, body) {
        if (error) {
          return reject(error);
        }
        resolve(body);
      });
    });
  });
}
