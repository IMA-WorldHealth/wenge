/**
* Database Connector
*
* Initializes a connection to the database using paramters provided in a
* configuration JSON object (via .env).  If the database does not exist, it will
* automatically build it for you.
*
* @module lib/db
*
* @requires sqlite
* @requires bluebird
*/

import db from 'sqlite';
import Promise from 'bluebird';

db.open('wenge.db', { verbose: true, Promise });

export default db;
