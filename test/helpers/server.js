/**
 * Test Helper Functions
 *
 * @requires path
 * @requires server/server
 */
import path from 'path';
import rm from 'rimraf';
import test from 'ava';
import express from 'express';
import server from '../../dist/server/server';

export function serve() {
  return server;
}

export function cleanup() {
  return new Promise((reject, resolve) => {
    rm(process.env.DB, {}, (err, done) => {
      if (err) { reject(err); } else { resolve(done); }
    });
  });
}
