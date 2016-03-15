/* eslint consistent-return: 0 */

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
import path from 'path';
import fs from 'fs';
import mailcomposer from 'mailcomposer';
import _ from 'lodash';
import Promise from 'bluebird';
import mailgun from 'mailgun-js';

const mg = mailgun({
  apiKey: process.env.MAILGUN_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

/** email templates */
const templates = {
  recover: fs.readFileSync(path.join(__dirname, '../emails/recover.html'), 'utf8'),
  invite: fs.readFileSync(path.join(__dirname, '../emails/invitation.html'), 'utf8'),
};

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
  const data = {};
  data.from = `${process.env.APP}@${process.env.MAILGUN_DOMAIN}`;
  data.to = address;

  // template in the parameters before configurting MIME type
  data.html = _.template(templates[key], params);

  return new Promise((resolve, reject) => {
    mailcomposer(data)
    .build((error, message) => {
      if (error) {
        return reject(error);
      }

      // prepare the message object for sending
      const msg = {
        to: address,
        message: message.toString('ascii'),
      };

      // send an HTML email through mailgun's API
      mg.messages()
      .sendMime(msg, (err, body) => {
        if (err) { return reject(error); }
        return resolve(body);
      });
    });
  });
}

export default send;
