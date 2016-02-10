const chai = require('chai');
const helpers = require('./helpers');
const expect = chai.expect;

/** set up testing helpers */
helpers.setup(chai);

describe('Users (signup)', function () {
  var agent = chai.request.agent(helpers.url);

  it('GET /users/invite/:id should error for an unknown id', function () {
    agent.get('/users/invite/100')
    .then(function (res) {
      helpers.errored(res);
    })
    .catch(helpers.handler);
  });

  it('POST /users/invite should invite a user to the system');

});

/** test that the API behaves correctly for authenticated users */
describe('Users (authenticated)', function () {
  'use strict';

  var agent = chai.request.agent(helpers.url);

  // new user to create
  var user = {
    username : 'test',
    email : 'test@test.example',
    displayname : 'test',
    roleid : 1,
    hidden : 0
  };

  /** make sure to login before each test */
  beforeEach(helpers.login(agent));

  it('GET /users should return a list of users', function () {
    return agent.get('/users')
    .then(function (res) {

      // make sure the API is conformant
      helpers.api.read(res);

      // we only have a single user in test datat
      expect(res.body).to.have.length(1);
      expect(res.body[0]).to.have.property('id', 'username', 'email');
      expect(res.body[0].username).to.equal('jniles');
    })
    .catch(helpers.handler);
  });

  it('GET /users/:id should return a single user', function () {
    return agent.get('/users/1')
      .then(function (res) {

        // make sure the API is conformant
        helpers.api.retrieved(res);

        // we only have a single user in test data
        expect(res.body).to.have.property('id', 'username', 'email');
        expect(res.body.username).to.equal('jniles');
      })
      .catch(helpers.handler);
  });

  it('POST /users should create a new user', function () {
    return agent.post('/users')
      .send(user)
      .then(function (res) {
        helpers.api.created(res);

        // bind the user's id for future tests
        user.id = res.body.id;

        // verify that we can find the user in the database
        return agent.get('/users/'.concat(user.id));
      })
      .then(function (res) {
        helpers.api.retrieved(res);
      })
      .catch(helpers.handler);
  });

  it('PUT /users/:id should update the details of a user', function () {
    return agent.put('/users/'.concat(user.id))
      .send({ displayname: 'updated' })
      .then(function (res) {
        helpers.api.updated(res);

        return agent.get('/users/'.concat(user.id));
      })
      .then(function (res) {
        helpers.api.retrieved(res);
      })
      .catch(helpers.handler);
  });

  it('DELETE /users/:id should delete a user', function () {
    return agent.delete('/users/'.concat(user.id))
      .then(function (res) {
        helpers.api.deleted(res);
      })
      .catch(helpers.handler);
  });

  it('POST /users/recover should send a recovery email to a user', function () {
    return agent.post('/users/recover')
    .send({ email : user.email })
    .then(function (res) {

      // behaves likes a create API request
      helpers.api.created(res);
    })
    .catch(helpers.handler);
  });

  it('POST /users/invite should send an invitation to a user', function () {
    agent.post('/users/invite')
    .send({ email : 'test@email.org' })
    .then(function (res) {

      // behaves like a created API request
      helpers.api.created(res);

      // should return a UUID for future acceptance
      helpers.isUuid(res.body.id);

      var id = res.body.id;

      // try to accept the invitation
      return agent.get('/users/invite/'.concat(id));
    })
    .then(function (res) {
      expect(res).to.redirectTo('/users/create');
    })
    .catch(helpers.handler);
  });
});


