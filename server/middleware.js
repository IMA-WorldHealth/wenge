/**
 * Middleware
 *
 * Configures the serverlication middleware for security, authentication, and
 * logging.
 */

/** require third part middleware */
const express     = require('express');
const session     = require('express-session');
const compression = require('compression');
const bodyParser  = require('body-parser');
const morgan      = require('morgan');
const helmet      = require('helmet');
const SQLiteStore = require('connect-sqlite3')(session);

/** application logger */
const logger = require('./logger');

/**
 * @param server - the expressjs server
 */
function middleware(server) {
  'use strict';

  /** pass everything through gzip */
  server.use(compression());

  /** hook up logging for the application using custom logger */
  server.use(morgan('common')({ stream : logger.stream }));

  /** use sensible headers and security defaults */
  server.use(helmet());

  /** configure static file directory*/
  server.use(express.static('client'));

  /** parse req.body's that have application/type JSON */
  server.use(bodyParser.json());

  /** parse req.body's that are urlencoded */
  server.use(bodyParser.urlencoded({ extended: false }));

  /** configure server session management using cookies and an SQLite store */
  server.use(session({
    store  : new SQLiteStore(),
    secret : process.env.SESS_SECRET,
    resave : false,
    saveUninitialized : false,
    unset  : 'destroy',
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week
  }));
}

module.exports = middleware;

