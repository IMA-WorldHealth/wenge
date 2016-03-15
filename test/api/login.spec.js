const chai = require('chai');
const helpers = require('./helpers');

/** set up testing helpers */
helpers.setup(chai);


/**
 * These tests are for login
 */
describe.only('Authentication', function () {

  const client = {
    username : 'jniles',
    password : 'password'
  };

  const attacker = {
    username : 'attacker',
    password : 'peabody'
  };

  it('(/login) allows a user', function () {
    chai.request(helpers.baseUrl)
      .post('/login')
      .send(client)
      .then(function (res) {
        helpers.api.read(res);
      });
  });

  it('(/login) rejects an attacker', function () {
    chai.request(helpers.baseUrl)
      .post('/login')
      .send(attacker)
      .catch(function (error) {
        console.log(error);
      });
  });

});
