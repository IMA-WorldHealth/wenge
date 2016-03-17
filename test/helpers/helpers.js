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
  await exec(`rm ${process.env.DB}`);
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
    connect();
  } catch (e) {
    throw e;
  }
}

/**
 * Setups up tests by initializing a server and database connection.
 */
export async function setup() {
  await database(app);

  // return the agent for usage in subsequent tests
  return request.agent(app);
}
