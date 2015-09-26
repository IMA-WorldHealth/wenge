var cfg  = require('./config'),
    path = require('path');

var gulp      = require('gulp'),
    gulpif    = require('gulp-if'),
    iife      = require('gulp-iife'),
    flatten   = require('gulp-flatten'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify'),
    rimraf    = require('rimraf');

// toggle to minify scripts
var MINIFY = false;

var paths = {
  config : 'config.js',
  client : {
    dir    : path.join(cfg.buildDir, 'client'),
    scripts: ['client/modules/app.js', 'client/modules/**/*.js'],
    vendor : ['client/vendor/**/*.min.js', 'client/vendor/**/dirPagination.js'],
    static : ['!client/*.js', '!client/**/*.js', '!client/vendor/*', '!client/vendor/**/*', 'client/*', 'client/**/*']
  },
  server : { 
    dir    : path.join(cfg.buildDir, 'server'),
    static : ['server/*.js', 'server/**/*'],
  },
  db : {
    dir    : path.join(cfg.buildDir, 'db'),
    static : ['db/*']
  }
};

gulp.task('clean', function (fn) {
  rimraf(cfg.buildDir, fn);
});

// concatenates all the client scripts into one
gulp.task('build-client', function () {
  gulp.start('client-minify', 'client-vendor', 'client-move');
});

// minify application code if necessary
gulp.task('client-minify', function () {
  return gulp.src(paths.client.scripts)
    .pipe(gulpif(MINIFY, uglify()))
    .pipe(concat('app.min.js'))
    .pipe(iife())
    .pipe(gulp.dest(paths.client.dir));
});

gulp.task('client-vendor', function () {
  return gulp.src(paths.client.vendor)
    .pipe(flatten())
    .pipe(gulp.dest(path.join(paths.client.dir, 'vendor')));
});

// move the client into the bin directory
gulp.task('client-move', function () {
  return gulp.src(paths.client.static)
    .pipe(gulp.dest(paths.client.dir));
});

gulp.task('build-server', function () {
  gulp.start('server-move', 'db-move');
});

// move the server into the bin/ directory
gulp.task('server-move', function () {
  return gulp.src(paths.server.static)
    .pipe(gulp.dest(paths.server.dir));
});

gulp.task('db-move', function () {
  return gulp.src(paths.db.static)
    .pipe(gulp.dest(paths.db.dir));
});

gulp.task('config-move', function () {
  return gulp.src(paths.config)
    .pipe(gulp.dest(cfg.buildDir));
});

// watch the client for changes and rebuild
gulp.task('watch', function () {
  gulp.watch(paths.client.scripts, ['build-client']);
  gulp.watch(paths.client.static, ['build-client']);
});

// build task for npm run start 
gulp.task('build', ['clean'], function () {
  gulp.start('build-client', 'build-server', 'config-move');
});

// default task runner
gulp.task('default', ['clean'], function () {
  gulp.start('build-client', 'build-server', 'watch');
});
