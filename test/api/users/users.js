/**
 * /users endpoint tests
 */

import test from 'ava';
import request from 'supertest-as-promised';
import * as helpers from '../../helpers/helpers';

let agent = null;
const url = '/users';

/**
 * Before the test suite, start the server and connect the database. Also
 * sets up the agent for sharing cookie information.
 */
test.before(async t => {
  agent = await helpers.setup();
});

test('users:index', async t => {
  t.plan(2);
  const res = await agent.get(url);
  t.is(res.status, 200);
  t.is(res.body.length, 1);
});

test.todo('users:read');
test.todo('users:create');
test.todo('users:update');
test.todo('users:remove');
test.todo('users:invite');
test.todo('users:redeem');
