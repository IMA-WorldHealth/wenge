/**
 * Authentication tests
 */

import test from 'ava';
import request from 'supertest-as-promised';
import {} from './_env';
import * as helpers from '../../helpers/helpers';

let agent = null;
const url = '/auth/basic';

/**
 * Before the test suite, start the server and connect the database. Also
 * sets up the agent for sharing cookie information.
 */
test.before(async t => {
  agent = await helpers.setup();
});

test('auth:failure:username', async t => {
  t.plan(2);

  const user = {
    username: 'fake',
    password: 'password',
  };

  const res = await agent.post(url).send(user);

  const description =
    `Bad username and password combination for ${user.username}`;

  t.is(res.status, 401);
  t.is(res.body.description, description);
});

test('auth:failure:password', async t => {
  t.plan(2);

  const user = {
    username: 'admin',
    password: 'password1', // the real password is 'password'
  };

  const res = await agent.post(url).send(user);

  const description =
    `Bad username and password combination for ${user.username}`;

  t.is(res.status, 401);
  t.is(res.body.description, description);
});

test('auth:failure:both', async t => {
  t.plan(2);

  const user = {
    username: 'fake',
    password: 'garbage',
  };

  const res = await agent.post(url).send(user);

  const description =
    `Bad username and password combination for ${user.username}`;

  t.is(res.status, 401);
  t.is(res.body.description, description);
});

test('auth:success', async t => {
  t.plan(5);

  const user = {
    username: 'admin',
    password: 'password',
  };

  const res = await agent.post(url).send(user);

  t.is(res.status, 200);
  t.is(res.body.username, 'admin');
  t.is(res.body.email, 'developers@imaworldhealth.org');
  t.is(res.body.roleid, 1);
  t.is(res.body.projectid, 1);
});

// remove database, etc
test.after('cleanup', helpers.cleanup);
