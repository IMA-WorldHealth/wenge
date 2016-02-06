const expect       = require('chai').expect;
const chaiHttp     = require('chai-http');
const chaiDatetime = require('chai-datetime');

/** set up chai plugins */
exports.setup = function setup(chai) {
  'use strict';

  chai.use(chaiHttp);
  chai.use(chaiDatetime);
};

/** automatically log a user in */
exports.login = function login(agent) {
  'use strict';

  // base user defined in test data
  var user = { username : 'jniles', password : 'password' };

  return function () {
    return agent.post('/login').send(user);
  };
};

/** base url for testing */
exports.url = 'http://localhost:4321';

/** throw errors caughtt in promises */
exports.handler = function handler(error) {
  throw error;
};

exports.isUuid = function isUuid(id) {
  expect(id).to.exist;
  expect(id).to.be.a('string');
  expect(id).to.have.length(36);
};

/** api tests to ensure API conformity */
var api = exports.api = {};

/**
 * Ensures that a create API request has returned the expected results for
 * further API usage.
 *
 * @method created
 * @param {object} res - the HTTP response object
 *
 * @example
 * var helpers = require('path/to/helpers.js');
 * var obj = { name : 'xyz', timestamp : new Date() }
 * agent.post('some/route')
 * .send(obj)
 * .then(function (res) {
 *   helpers.api.created(res);
 *
 *   // do something useful with the response, like further tests
 * })
 * .catch(helpers.hanlder);
 */
api.created = function created(res) {
  'use strict';

  // make sure the response has correct HTTP headers
  expect(res).to.have.status(201);
  expect(res).to.be.json;

  // ensure that we received a correct id in return
  expect(res.body).to.not.be.empty;
  expect(res.body).to.have.property('id');
  expect(res.body.uuid).to.be.a('number');
};

/**
 * Ensures that an API request has properly errored with translateable text.
 *
 * @method errored
 * @param {object} res - the HTTP response object
 * @param {number} status - the appropiate HTTP status
 *
 * @example
 * var helpers = require('path/to/helpers.js');
 * agent.get('some/invalid/id')
 * .then(function (res) {
 *   helpers.api.errored(res);
 * })
 * .catch(helpers.hanlder);
 */
api.errored = function errored(res, status) {
  'use strict';

  // make sure the response has the correct HTTP headers
  expect(res).to.have.status(status);
  expect(res).to.be.json;

  // the error reason should be sent back
  expect(res.body).to.not.be.empty;
  expect(res.body).to.have.property('reason');

  // ensure the error properties conform to standards
  expect(res.body.reason).to.be.a('string');
};

/**
 * @TODO
 * Ensures that an original object has been updated.  Does not support
 * deep equality.
 *
 * @note - this will have some issues with dates.
 *
 * @method updated
 * @param {object} res - the HTTP response object
 * @param {object} original - the virgin object before changes
 * @param {array} changedKeys - a list of properties expected to change
 *
 * @example
 * agent.get('some/id') // TODO
 */
api.updated = function updated(res, original, changedKeys) {
  'use strict';

  // make sure the response has the correct HTTP headers
  expect(res).to.have.status(200);
  expect(res).to.be.json;

  // make sure we received a body
  expect(res.body).to.not.be.empty;

  // loop through the body, asserting that only the correct properties
  // have changed
  Object.keys(res).forEach(function (key) {

    // if the key is in "changedKeys", it should not equal the original
    if (changedKeys.indexOf(key) > -1) {
      expect(res.body[key]).to.not.equal(original[key]);
    } else {
      expect(res.body[key]).to.equal(original[key]);
    }
  });
};

/**
 * Ensures that a DELETE API request was successful and conforms to API
 * standards.
 *
 * @method deleted
 * @param {object} res - the HTTP response object
 *
 * @example
 * var helpers = require('path/to/helpers');
 *
 * agent.delete('some/id')
 * .then(function (res) {
 *   helpers.api.deleted(res);
 * })
 * .catch(helpers.handler);
 */
api.deleted = function deleted(res) {
  'use strict';

  // make sure that the response has the correct HTTP headers
  expect(res).to.have.status(204);
  expect(res.body).to.be.empty;
};

/**
 * Ensures that a GET API request was successful and conforms to API
 * standards. This is to retrieve a single item from the database.
 *
 * @method read
 * @param {object} res - the HTTP response object
 *
 * @example
 * var helpers = require('path/to/helpers');
 *
 * agent.get('some/:id')
 * .then(function (res) {
 *   helpers.api.read(res);
 * })
 * .catch(helpers.handler);
 */
api.read = function read(res) {
  'use strict';

  // definitely should have found the object
  expect(res).to.have.status(200);
  expect(res).to.be.json;

  // this should return a single object
  expect(res.body).to.be.a('object');
  expect(res.body).to.have.property('id');
  expect(res.body.id).to.be.a('number');
};

/**
 * Ensures that a GET API request was successful and conforms to API
 * standards. This is to retrieve an array of items from the database.
 *
 * @method retrieved
 * @param {object} res - the HTTP response object
 *
 * @example
 * var helpers = require('path/to/helpers');
 *
 * agent.get('some/:id')
 * .then(function (res) {
 *   helpers.api.read(res);
 * })
 * .catch(helpers.handler);
 */
api.retrieved = function retrieved(res) {
  'use strict';

  // make these will always return an array
  expect(res).to.have.status(200);
  expect(res).to.be.json;

  // this should return a single object
  expect(res.body).to.be.a('array');
  expect(res.body).to.have.length.above(0);
};
