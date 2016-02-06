/**
* Wenge
*
* This is the server for the wenge serverlication.
*/

/** load environmental variables */
var envPath = `.env.${ process.env.NODE_ENV.toLowerCase().trim() }`;
require('dotenv').load({ path : envPath });

/** import dependencies */
const multer      = require('multer');
const attachments = multer({ dest : './server/attachments/' });

/** create the server */
const server = require('express')();

/** configure the database connection */
require('./lib/db');

/** import the logger */
const logger = require('./logger');

/** route endpoints */
const auth     = require('./controllers/auth');
const users    = require('./controllers/users');
const requests = require('./controllers/requests');
const projects = require('./controllers/projects');
const colors   = require('./controllers/colors');

/* Server Routes */
/* -------------------------------------------------------------------------- */

/** Public Routes (not behind auth gateway) */

server.post('/login', auth.login);
server.get('/logout', auth.logout);

server.post('/users/recover', users.recover);

// ensure that the user session is defined
server.use(auth.gateway);

/** "Private" Routes (require authentication) */

// user controller
server.post('/users', users.create);
server.get('/users/', users.list);
server.get('/users/:id', users.detail);
server.put('/users/:id', auth.owner('id'), users.update);
server.delete('/users/:id', auth.owner('id'), users.delete);

// request controller
server.post('/requests', requests.create);
server.get('/requests/:id?', requests.read);
server.put('/requests/:id', requests.update);
server.delete('/requests/:id', requests.delete);

// projects controller
server.post('/projects', projects.create);
server.get('/projects/:id?', projects.read);
server.put('/projects/:id', projects.update);
server.delete('/projects/:id', projects.delete);

server.post('/projects/:projectId/subprojects', projects.subprojects.create);
server.get('/projects/:projectId/subprojects/:id?', projects.subprojects.read);
server.put('/projects/:projectId/subprojects/:id', projects.subprojects.update);
server.delete('/projects/:projectId/subprojects/:id', projects.subprojects.delete);

server.get('/colors', colors.read);

// TODO
// handle attachments
// mas number of attachments is 5
server.post('/upload', attachments.array('attachment', 5), function (req, res, next) {
  'use strict';

  res.status(200).json({
    filenames : req.files.map(function (f) { return f.filename; })
  });

  next();
});

// error handler
server.use(function (error, res, req, next) {
  logger.error('An http error occured: %j', error.stack);
  res.status(500).send('Something broke!');
});

/** listen on the appropriate port */
server.listen(process.env.PORT, function listen() {
  logger.info('Server is listening on port %s.', process.env.PORT);
});

/** no logging needed - the app logger will automatically catch it */
process.on('uncaughtException', function (err) {
  process.exit(1);
});
