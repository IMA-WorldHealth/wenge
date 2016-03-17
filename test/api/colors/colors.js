/**
 * The /colors endpoint tests written with concurrent capabilities
 */

import test from 'ava';
import request from 'supertest-as-promised';
import {} from './_env';
import * as helpers from '../../helpers/helpers';

let agent = null;

/**
 * Before the test suite, start the server and connect the database. Also
 * sets up the agent for sharing cookie information.
 */
test.before(async t => {
  const app = helpers.app();

  // prepare for the tests by building the database
  await helpers.database(app);

  // bind the agent to be used in subsequent tests
  agent = request.agent(app);
});


test('colors:index', async t => {
  t.plan(2);

  const res = await agent.get('/colors');

  t.is(res.status, 200);
  t.is(res.body.length, 20);
});

// remove database, etc
test.after('cleanup', async t => {
  await helpers.cleanup();
});
