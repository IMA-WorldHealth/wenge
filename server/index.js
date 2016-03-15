/**
* Wenge Server
*
* This is the server for Senge.  Wenge is a simple application to help
* organisations go paperless through electronic requests for funds.  For more
* information, check out the repository found in the package.json file.
*
* @module server
*
* @requires path
* @requires dotenv
* @requires express
* @requires lib/logger
* @requires controllers
* @requires controllers/auth
* @requires middleware
*/

import dotenv from 'dotenv/config';
import path from 'path';
import express from 'express';
import logger from './lib/logger';
import controllers from './controllers';
import auth from './controllers/auth';
import middleware from './middleware';

/** create the server */
const server = express();

/** (pre authentication) */
server.use(middleware);

server.post('/login', auth.login);
server.get('/logout', auth.logout);

// make sure so unauthorized requests can get through
server.use(auth.gateway);

/** (post authentication) */

// bind controllers
server.use(controllers);

// error handler
server.use((error, req, res, next) => {
  logger.error('An http error occured:', error.stack);
  res.status(500).send('Something broke!');
});

/** listen on the appropriate port */
server.listen(process.env.PORT, () => {
  logger.info('Server is listening on port %s.', process.env.PORT);
});

/** no logging needed - the app logger will automatically catch it */
process.on('uncaughtException', () => {
  process.exit(1);
});
