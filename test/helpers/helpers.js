/**
 * Test Helper Functions
 *
 * @requires server
 * @requires lib/db
 * @requires promised-exec
 * @requires fs
 */

import {} from './_env';
import app from '../../dist/server/server';
import { connect } from '../../dist/server/lib/db';

import request from 'supertest-as-promised';
import exec from 'promised-exec';
import fs from 'fs';

export async function cleanup() {
  try {
    await exec(`rm ${process.env.DB}`);
  } catch (e) {
    throw e;
  }
}

/**
 * Pepares the database by removing the old test file and rebuilding fresh data
 * from the database's SQL files.  Once the database is built, it connects the
 * database instance for the server to use.
 */
async function database(server) {
  const dir = server.get('dir');

  try {
    fs.accessSync(`${process.env.DB}`, fs.F_OK);
    await exec(`rm ${process.env.DB}`);
  } catch (e) {
    throw e;
  }

  try {
    // build the database's test data
    await exec(`sqlite3 ${process.env.DB} < ${dir}/lib/db/schema.sql`);
    await exec(`sqlite3 ${process.env.DB} < ${dir}/lib/db/data.sql`);

    // connect the database
    await connect();
  } catch (e) {
    throw e;
  }
}

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
    await database(app);
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
