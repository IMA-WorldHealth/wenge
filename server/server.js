/**
* Wenge Server
*
* This is the server for the wenge application.
*/

var path     = require('path'),
    config   = require(path.join(__dirname, '../config'));

// import dependencies
var express     = require('express'),
    session     = require('express-session'),
    compression = require('compression'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    multer      = require('multer'),
    attachments = multer({ dest : './server/attachments/' }),
    FileStore   = require('session-file-store')(session),
    helmet      = require('helmet'),
    app         = express();

// configure database
require('./lib/db').setup(config);

var auth     = require('./controllers/auth'),
    users    = require('./controllers/users'),
    requests = require('./controllers/requests'),
    projects = require('./controllers/projects'),
    accounts = require('./controllers/accounts'),
    colors   = require('./controllers/colors');

// middleware
app.use(compression());
app.use(morgan('common'));
app.use(helmet());
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// session management
app.use(session({
  store  : new FileStore({ reapInterval : -1 }),
  secret : 'x0r world HeaLth',
  resave : false,
  saveUninitialized : false,
  unset  : 'destroy',
}));

/* Server Routes */
/* -------------------------------------------------------------------------- */

/* "Public" Routes (not behind auth gateway) */

app.post('/login', auth.login);
app.get('/logout', auth.logout);

app.post('/users/recover', users.recover);

// ensure that the user session is defined
app.use(auth.gateway);

/* "Private" Routes (require authentication) */


// user controller
app.post('/users', users.create);
app.get('/users/:id?', users.read);
app.put('/users/:id', auth.owner('id'), users.update);
app.delete('/users/:id', auth.owner('id'), users.delete);

// request controller
app.post('/requests', requests.create);
app.get('/requests/:id?', requests.read);
app.put('/requests/:id', requests.update);
app.delete('/requests/:id', requests.delete);

// projects controller
app.post('/projects', projects.create);
app.get('/projects/:id?', projects.read);
app.put('/projects/:id', projects.update);
app.delete('/projects/:id', projects.delete);

app.post('/projects/:projectId/subprojects', projects.subprojects.create);
app.get('/projects/:projectId/subprojects/:id?', projects.subprojects.read);
app.put('/projects/:projectId/subprojects/:id', projects.subprojects.update);
app.delete('/projects/:projectId/subprojects/:id', projects.subprojects.delete);


app.get('/colors', colors.getColors);

// TODO
// handle attachments
// mas number of attachments is 5
app.post('/upload', attachments.array('attachment', 5), function (req, res, next) {
  'use strict';

  res.status(200).json({
    filenames : req.files.map(function (f) { return f.filename; })
  });
});

// error handler
app.use(function (err, res, req, next) {
  console.error('[APP] [ERROR] HTTP Error:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(config.port, function () {
  console.log('[APP] [INFO] Server is listening on port', config.port);
});

process.on('uncaughtException', function (err) {
  console.error('[APP] [ERROR] Uncaught Error:', err.stack);
});
