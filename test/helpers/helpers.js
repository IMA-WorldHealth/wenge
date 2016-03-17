/**
 * Test Helper Functions
 *
 * @requires server
 * @requires lib/db
 * @requires promised-exec
 * @requires fs
 */
import {} from './_env';
import server from '../../dist/server/server';
import { connect } from '../../dist/server/lib/db';
import exec from 'promised-exec';
import fs from 'fs';

export function app() {
  return server;
}

export async function cleanup() {
  await exec(`rm ${process.env.DB}`);
}

/**
 * Pepares the database by removing the old test file and rebuilding fresh data
 * from the database's SQL files.  Once the database is built, it connects the
 * database instance for the server to use.
 */
export async function database(application) {
  const dir = application.get('dir');

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
