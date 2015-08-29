var express     = require('express'),
    session     = require('express-session'),
    compression = require('compression'),
    bodyParser  = require('body-parser'),
    morgan      = require('morgan'),
    FileStore   = require('session-file-store')(session),
    app         = express();

var PORT = 4321;

var db = require('./lib/db'),
    auth = require('./routes/auth'),
    users = require('./routes/users'),
    requests = require('./routes/requests'),
    projects = require('./routes/projects');

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
  store : new FileStore(),
  secret : 'xor Y0Mama',
  saveUninitialized : false,
  resave : false,
  unset             : 'destroy',
  //cookie            : { secure : true }
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
app.get('/colors', projects.getColors);

// user controller
app.get('/users/:id', users.getUserById);
app.post('/users', users.signup);

// request controller
app.get('/requests', requests.getRequests);
app.post('/requests', requests.createRequests);
app.get('/requests/:id', requests.getRequestsById);
app.put('/requests/:id', requests.updateRequests);
app.delete('/requests/:id', requests.deleteRequests);

// projects controller
app.get('/projects', projects.getProjects);
app.get('/projects/:id', projects.getProjectById);
app.post('/projects', projects.createProject);
app.put('/projects/:id', projects.editProject);
app.delete('/projects/:id', projects.removeProject);

// error handler
app.use(function (err, res, req, next) {
  console.error('An error occured:', err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, function () {
  console.log('Server is listening on port', PORT);
});

process.on('uncaughtException', function (err) {
  console.error('Error:', err.stack);
});
