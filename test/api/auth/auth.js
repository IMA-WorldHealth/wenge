/**
 * Authentication tests
 */

import test from 'ava';
import request from 'supertest-as-promised';
import * as helpers from '../../helpers/helpers';

/** the url for this test suite */
const url = '/auth/basic';

/**
 * Before the test suite, start the server and connect the database.  In this case, we wish to
 * avoid sharing cookies, so we create a new request using the server exported from the helpers
 * module.
 */
test.only('auth:failure:username', async t => {
  t.plan(2);

  const user = {
    username: 'fake',
    password: 'password',
  };

  const res = await request(helpers.app).post(url).send(user);

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

  const res = await request(helpers.app).post(url).send(user);

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

  const res = await request(helpers.app).post(url).send(user);

  const description =
    `Bad username and password combination for ${user.username}`;

  t.is(res.status, 401);
  t.is(res.body.description, description);
});

test('auth:forbidden', async t => {
  t.plan(1);

  // useing vouchers api just for kicks
  const res = await request(helpers.app).get('/vouchers');
  t.is(res.status, 403);
});

test('auth:success', async t => {
  t.plan(5);

  const user = {
    username: 'admin',
    password: 'password',
  };

  const res = await request(helpers.app).post(url).send(user);

  t.is(res.status, 200);
  t.is(res.body.username, 'admin');
  t.is(res.body.email, 'developers@imaworldhealth.org');
  t.is(res.body.roleid, 1);
  t.is(res.body.projectid, 1);
});
