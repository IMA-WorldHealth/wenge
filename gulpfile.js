/* eslint-disable */

'use strict';

const path = require('path');

const gulp         = require('gulp');
const gulpif       = require('gulp-if');
const babel        = require('gulp-babel');
const sourcemaps   = require('gulp-sourcemaps');
const concat       = require('gulp-concat');
const nano         = require('gulp-cssnano');
const autoprefixer = require('gulp-autoprefixer');
const iife         = require('gulp-iife');
const sass         = require('gulp-sass');
const uglify       = require('gulp-uglify');
const merge        = require('merge-stream');

// load environmental variables
require('dotenv').config();

// are we n development or production mode?
var PRODUCTION = (process.env.NODE_ENV === 'production');

// paths for building app components
var paths = {
  client:   {
    dir:    path.join(process.env.BUILD_DIR, 'client'),
    js:     ['client/modules/app.js', 'client/modules/**/*.js'],
    sass:   ['sass/*.scss'],
    vendor: [
      'client/vendor/angular/*.min.js',
      'client/vendor/angular-route/*.min.js',
      'client/vendor/angular-moment/*.min.js',
      'client/vendor/angular-file-upload/dist/*.min.js',
      'client/vendor/angular-bootstrap/*.min.js',
      'client/vendor/angular-resource/*.min.js',
      'client/vendor/angular-ui-grid/*.min.js'
    ],
    static: ['!client/**/*.js', '!client/css/*', '!client/vendor/*', '!client/vendor/**/*', 'client/*', 'client/**/*']
  }
};

gulp.task('build-server', function () {
  let js = gulp.src('server/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/server'));

  let html = gulp.src('server/**/*.html')
    .pipe(gulp.dest('dist/server'));

  merge(js, html);
});

// concatenates all the client scripts into one
gulp.task('build-client', function () {
  gulp.start('client-js', 'client-styles', 'client-vendor', 'client-move');
});

// minify application code if necessary
gulp.task('client-js', function () {
  return gulp.src(paths.client.js)
    .pipe(sourcemaps.init())
    .pipe(gulpif(PRODUCTION, uglify({ mangle : true })))
    .pipe(concat('app.min.js', { newLine: ';' }))
    .pipe(iife())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.client.dir));
});

gulp.task('client-styles', function () {
  return gulp.src(paths.client.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(PRODUCTION, nano()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.join(paths.client.dir, 'css')));
});

gulp.task('client-vendor', function () {
  return gulp.src(paths.client.vendor)
    .pipe(sourcemaps.init())
    .pipe(gulpif(PRODUCTION, uglify({ mangle : true })))
    .pipe(concat('vendor.min.js', { newLine: '\n;'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.client.dir));
});

// move the client into the bin directory
gulp.task('client-move', function () {
  return gulp.src(paths.client.static)
    .pipe(gulp.dest(paths.client.dir));
});

// watch the client for changes and rebuild
gulp.task('watch', function () {
  gulp.watch(paths.client.js, ['build-client']);
  gulp.watch(paths.client.static, ['build-client']);
});

// build task for npm run start
gulp.task('build', function () {
  gulp.start('build-client', 'build-server');
});

// default task runner
gulp.task('default', function () {
  gulp.start('build-client', 'build-server', 'watch');
});
