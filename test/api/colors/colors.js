/**
 * /colors endpoint tests
 */

import test from 'ava';
import request from 'supertest-as-promised';
import * as helpers from '../../helpers/helpers';

let agent = null;

/**
 * Before the test suite, start the server and connect the database. Also
 * sets up the agent for sharing cookie information.
 */
test.before(async t => {
  agent = await helpers.setup();
});

test('colors:index', async t => {
  t.plan(2);

  const res = await agent.get('/colors');

  t.is(res.status, 200);
  t.is(res.body.length, 20);
});
