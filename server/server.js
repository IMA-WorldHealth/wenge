/**
* Wenge Server
*
* This is the server for Wenge.  Wenge is a simple application to help
* organisations go paperless through electronic requests for funds.  For more
* information, check out the repository found in the package.json file.
*
* @module server
*
* @requires express
* @requires lib/logger
* @requires lib/errors
* @requires controllers
* @requires middleware
*
* @todo - better documentation of the bound middlewares/controllers
*/

import express from 'express';
import logger from './lib/logger';
import controllers from './controllers';
import * as auth from './controllers/auth';
import middleware from './middleware';
import { handler } from './lib/errors';

/** create the server */
const server = express();

/** (pre authentication) */
server.use(middleware);

server.post('/auth/basic', auth.login);
server.post('/auth/logout', auth.logout);

// make sure so unauthorized requests can get through
server.use(auth.gateway);

// bind controllers
server.use(controllers);

// error handler
server.use(handler);

// set the directory
server.set('dir', __dirname);

export { logger };
export default server;
