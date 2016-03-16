/**
 * Test Helper Functions
 *
 * @requires server/server
 * @requires promised-exec
 * @requires fs
 */
import server from '../../dist/server/server';
import exec from 'promised-exec';
import fs from 'fs';

export function serve() {
  return server;
}

export async function cleanup() {
  console.log('cleaning up');
  await exec(`rm ${process.env.DB}`);
  console.log('clean!');
}

export async function prepare() {
  const dir = '/home/jniles/code/wenge/dist/server';

  try {
    fs.accessSync(`${process.env.DB}`, fs.F_OK);
    console.log(`delete ${process.env.DB}`);
    await exec(`rm ${process.env.DB}`);
    console.log(`deleted ${process.env.DB}`);
  } catch (e) {
    console.log('ERR:', e);
  }

  try {
    console.log('building databases ...');
    await exec(`sqlite3 ${process.env.DB} < ${dir}/lib/db/schema.sql`);
    await exec(`sqlite3 ${process.env.DB} < ${dir}/lib/db/data.sql`);
    console.log('databases built');
  } catch (e) {
    console.log('ERR:', e);
  }
}
