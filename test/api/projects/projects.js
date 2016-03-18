/**
 * The /projects endpoint tests written with concurrent capabilities
 */

import test from 'ava';
import request from 'supertest-as-promised';
import * as helpers from '../../helpers/helpers';

let agent = null;

/**
 * Before the test suite, start the server and connect the database. Also
 * sets up the agent for sharing cookie information.
 */
test.before(async t => {
  agent = await helpers.setup();
});

// there are currently three projects registered in the database
test('projects:index', async t => {
  t.plan(2);

  const res = await agent.get('/projects');

  t.is(res.status, 200);
  t.is(res.body.length, 3);
});

// should read an existing project
test('projects:read:200', async t => {
  t.plan(2);

  const res = await agent.get('/projects/1');

  t.is(res.status, 200);
  t.is(res.body.id, 1);
});

// skipped until a user login method is created
test.skip('projects:create:201', async t => {
  t.plan(3);

  const project = {
    code: 1230,
    color: '#3414',
    createdby: 1,
  };

  let res = await agent
    .post('/projects')
    .send(project);

  // should have been created
  t.is(res.status, 201);
  project.id = res.body.id;

  res = await agent.get(`/projects/${res.body.id}`);

  // make sure that it comes back properly
  t.is(res.status, 200);
  t.same(res.body, project);
});

// skipped until the ability to login is created
test.skip('projects:Create:400', async t => {
  t.plan(1);

  const project = {
    color: '#3414',
  };

  const res = await agent
    .post('/projects')
    .send({ project });

  // should not have been created
  t.is(res.status, 400);
});

// update an existing project
test('project:update:200', async t => {
  t.plan(4);

  const updates = {
    id: 23,
    code: '10002',
    color: '#0101DF', // a nice blue color
  };

  // update id 1
  const id = 1;

  const res = await agent
    .put(`/projects/${id}`)
    .send(updates);

  t.is(res.status, 200);
  t.is(res.body.id, id);
  t.is(res.body.color, updates.color);
  t.is(res.body.code, updates.code);
});

// should not find a nonexistant project
test('projects:read:404', async t => {
  t.plan(2);

  const res = await agent.get('/projects/3.141592');

  t.is(res.status, 404);
  t.is(res.body.status, 404);
});
