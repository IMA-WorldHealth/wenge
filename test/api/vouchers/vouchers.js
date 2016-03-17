/**
 * /vouchers endpoint tests
 */

import test from 'ava';
import request from 'supertest-as-promised';
import {} from './_env';
import * as helpers from '../../helpers/helpers';

let agent = null;
const url = '/vouchers';

/**
 * Before the test suite, start the server and connect the database. Also
 * sets up the agent for sharing cookie information.
 */
test.before(async t => {
  agent = await helpers.setup();
});

test.skip('vouchers:index', async t => {
  t.plan(2);
  const res = await agent.get(url);
  t.is(res.status, 200);
  t.same(res.body, []);
});

test.todo('vouchers:read');
test.todo('vouchers:create');
test.todo('vouchers:update');
test.todo('vouchers:remove');

/**
 * After test suite finishes running, remove temporary databases.
 */
test.after('cleanup', helpers.cleanup);
