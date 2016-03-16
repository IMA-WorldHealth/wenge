/**
* Database Connector
*
* Initializes a connection to the database using paramters provided in a
* configuration JSON object (via .env).  If the database does not exist, it will
* automatically build it for you.
*
* @module lib/db
*
* @requires path
* @requires sqlite
* @requires bluebird
*/

import db from 'sqlite';
import Promise from 'bluebird';
import exec from 'promised-exec';

// rebuilds the database if necessary
async function rebuild() {
  try {
    await exec(`sqlite3 ${process.env.DB} < ${__dirname}/schema.sql`);
    await exec(`sqlite3 ${process.env.DB} < ${__dirname}/data.sql`);
  } catch (e) {
    console.log('error:', e);
    throw e;
  }
}

// open the database file in DB
db.open(process.env.DB, { verbose: true, Promise });

// load data into the database files if they do not exist
if (Boolean(process.env.DB_REBUILD)) {
  rebuild();
}

export default db;
