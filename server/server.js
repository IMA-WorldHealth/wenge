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
    app         = express();

// configure database
require('./lib/db').setup(config);

var auth     = require('./controllers/auth'),
    users    = require('./controllers/users'),
    requests = require('./controllers/requests'),
    projects = require('./controllers/projects'),
    colors   = require('./controllers/colors');

// middleware
app.use(compression());
app.use(morgan('common'));
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  store  : new FileStore({ reapInterval : -1 }),
  secret : 'x0r world HeaLth',
  resave : false,
  saveUninitialized : false,
  unset  : 'destroy'
}));

/* Server Routes */
/* -------------------------------------------------------------------------- */

/* "Public" Routes (not behind auth gateway) */

app.post('/login', auth.login);
app.get('/logout', auth.logout);

// TODO make this a separate controller
app.post('/users/accountrecovery', users.accountRecovery);

// ensure that the user session is defined
app.use(auth.gateway);

/* "Private" Routes (require authentication) */

app.get('/colors', colors.getColors);

// user controller
app.get('/users/:id', users.getUsersById);
app.get('/users', users.getUsers);
app.post('/users', users.signup);
app.put('/users/:id', users.updateUsers);

// request controller
app.get('/requests', requests.getRequests);
app.post('/requests', requests.createRequests);
app.get('/requests/:id', requests.getRequestsById);
app.put('/requests/:id', requests.updateRequests);
app.delete('/requests/:id', requests.deleteRequests);

// TODO
// handle attachments
// mas number of attachments is 5
app.post('/upload', attachments.array('attachment', 5), function (req, res, next) {
  'use strict';

  res.status(200).json({
    filenames : req.files.map(function (f) { return f.filename; })
  });
});


// projects controller
app.get('/projects', projects.getProjects);
app.get('/projects/:id', projects.getProjectById);
app.post('/projects', projects.createProject);
app.put('/projects/:id', projects.updateProject);
app.delete('/projects/:id', projects.deleteProject);


// error handler
app.use(function (err, res, req, next) {
  console.error('An error occured:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(config.port, function () {
  console.log('[APP] [INFO] Server is listening on port', config.port);
});

process.on('uncaughtException', function (err) {
  console.error('[APP] [ERROR] ', err.stack);
});
