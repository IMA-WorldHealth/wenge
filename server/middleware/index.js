/**
 * Middleware
 *
 * Configures the middleware for security, authentication, and
 * logging.
 *
 * @module server/middleware
 *
 * @requires express
 * @requires express-session
 * @requires compression
 * @requires body-parser
 * @requires morgan
 * @requires helmet
 * @requires connect-sqlite3
 */

import express from 'express';
import session from 'express-session';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import store from 'connect-sqlite3';

// get the logger
import logger from '../lib/logger';

/** create the SQL store */
const SQLiteStore = store(session);

/** this is the middle ware **/
const middleware = express();

/** pass everything through gzip */
middleware.use(compression());

/** hook up logging for the application using custom logger */
// TODO -- make this work
// middleware.use(morgan('common')({ stream: logger.stream }));
middleware.use(morgan('common'));

/** use sensible headers and security defaults */
middleware.use(helmet());

/** configure static file directory*/
middleware.use(express.static('client'));

/** parse req.body's that have application/type JSON */
middleware.use(bodyParser.json());

/** parse req.body's that are urlencoded */
middleware.use(bodyParser.urlencoded({ extended: false }));

/** configure middleware session management using cookies and an SQLite store */
middleware.use(session({
  store: new SQLiteStore(),
  secret: process.env.SESS_SECRET,
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
}));

// expose to the outside world
export default middleware;
