/**
 * The /projects endpoint tests written with concurrent capabilities
 */

import request from 'supertest-as-promised';
import test from 'ava';
import {} from '../helpers/env';  // HACK :)
import { serve, cleanup } from '../helpers/server';

// there are currently three projects registered in the database
test('projects:Index', async t => {
  t.plan(3);

  const res = await request(serve())
    .get('/projects');

  t.is(res.status, 200);
  t.is(res.body.length, 3);
});

// should read an existing project
test('projects:Read:200', async t => {
  t.plan(2);

  const res = await request(serve())
    .get('/projects/1');

  t.is(res.status, 200);
  t.is(res.body.id, 1);
});


// should not find a nonexistant project
test('projects:Read:404', async t => {
  t.plan(2);

  const res = await request(serve())
    .get('/projects/3.141592');

  t.is(res.status, 404);
  t.is(res.body.status, 404);
});

// remove test artifacts
test.after('cleanup', async t => {
  await cleanup();
});
