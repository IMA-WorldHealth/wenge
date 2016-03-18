/**
 * Test Helper Functions
 *
 * @requires server
 * @requires supertest-as-promised
 */

import {} from './_env';
import app from '../../dist/server/server';
import request from 'supertest-as-promised';

/**
 * Setups up tests by initializing a server and database connection.
 */
export async function setup() {
  const agent = request.agent(app);

  const user = {
    username: 'admin',
    password: 'password',
  };

  try {
    console.log('before');
    await agent.post('/auth/basic').send(user);
    console.log('after');
  } catch (e) {
    throw e;
  }

  // return the agent for usage in subsequent tests
  return agent;
}

/** re-export app for consumption in auth */
export { app };
