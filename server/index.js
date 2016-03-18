/**
 * Wrapper for Wenge Server
 *
 * This wrapper starts the server on import.  If you want to get the server
 * without automatically listening to a port, use the server.js file.
 *
 * @module server
 * @requires server/server.js
 *
 * @todo - allow clustering via the cluster module
 */

import dotenv from 'dotenv/config';
import server, { logger } from './server';

/** listen on the appropriate port */
server.listen(process.env.PORT, () => {
  logger.info(`Server is listening on port ${process.env.PORT}.`);
});
