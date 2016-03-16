/**
 * Controllers
 *
 * This module configures the routes for wenge's server.  The controllers are
 * all exported via es6  modules and attached to a sub-application that can be
 * easily consumed by the wenge server on re-export.
 *
 * @module server/controllers
 *
 * @requires express
 * @requires controllers/users
 * @requires controllers/projects
 */
import express from 'express';

import * as users from './users';
import * as projects from './projects';
// import * as requests from './requests';

const ctrls = express();

/** CRUD for users and permissions */
ctrls.get('/users', users.index);
ctrls.get('/users/invite', users.invite);
ctrls.get('/users/:id', users.read);
ctrls.put('/users/:id', users.update);
ctrls.post('/users/', users.create);
ctrls.delete('/users/:id', users.delete);
ctrls.post('/users/invite', users.invite);
ctrls.post('/users/recover', users.recover);

/** CRUD for projects */
ctrls.get('/projects', projects.index);
ctrls.get('/projects/:id', projects.read);
ctrls.put('/projects/:id', projects.update);
ctrls.post('/projects', projects.create);
ctrls.delete('/projects/:id', projects.delete);


/** CRUD for requests */
// ctrls.use('/requests', require('./requests'));

export default ctrls;
