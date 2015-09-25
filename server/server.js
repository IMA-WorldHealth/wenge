/**
* Wenge Server
*
* This is the server for the wenge application.
*/

// import dependencies
var express     = require('express'),
    path        = require('path'),
    session     = require('express-session'),
    compression = require('compression'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    multer      = require('multer'),
    attachments = multer({ dest : './attachments/' }),
    FileStore   = require('session-file-store')(session),
    app         = express();

var config   = require(path.join(__dirname, '../config'));

var db       = require('./lib/db')(config),
    auth     = require('./controllers/auth'),
    users    = require('./controllers/users'),
    requests = require('./controllers/requests'),
    projects = require('./controllers/projects'),
    colors   = require('./controllers/colors');

app.set('appname', config.appname);

// compress (gzip) all requests
app.use(compression());

// log all incoming requests
app.use(morgan('common'));

// public folder
app.use(express.static('client'));

// use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// store user sessions in a file store for later lookups
app.use(session({
  store  : new FileStore({ reapInterval : -1 }),
  secret : 'x0r world HeaLth',
  resave : false,
  saveUninitialized : false,
  unset  : 'destroy'
}));

// First route exposed is /login so that our user can
// initiate sessions and /logout in case something went
// wrong.
app.post('/login', auth.login);
app.get('/logout', auth.logout);
app.post('/users/accountrecovery', users.userAccountRecovery);

// ensure that the user session is defined
app.use(auth.gateway);

// misc
app.get('/colors', colors.getColors);

// user controller
app.get('/users/:id', users.getUserById);
app.get('/users', users.getUsers);
app.post('/users', users.signup);

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
