var path = require('path');

var gulp       = require('gulp'),
    gulpif     = require('gulp-if'),
    sourcemaps = require('gulp-sourcemaps'),
    flatten    = require('gulp-flatten'),
    concat     = require('gulp-concat'),
    nano       = require('gulp-cssnano'),
    uncss      = require('gulp-uncss'),
    iife       = require('gulp-iife'),
    uglify     = require('gulp-uglify'),
    rimraf     = require('rimraf');

// load environmental variables
require('dotenv').load();

// are we in development or production mode?
var PRODUCTION = process.env.ENV === "production";

// paths for building app components
var paths = {
  client : {
    dir    : path.join(process.env.BUILD_DIR, 'client'),
    scripts: ['client/modules/app.js', 'client/modules/**/*.js'],
    vendor : ['!client/vendor/angular-bootstrap/ui-bootstrap.min.js', 'client/vendor/**/*.min.js', 'client/vendor/**/dirPagination.js'],
    styles : ['client/css/*.css'],
    static : ['!client/*.js', '!client/**/*.js', '!client/css/*', '!client/vendor/*', '!client/vendor/**/*', 'client/*', 'client/**/*']
  },
  server : {
    dir    : path.join(process.env.BUILD_DIR, 'server'),
    static : ['server/*.js', 'server/**/*'],
  },
  db : {
    dir    : path.join(process.env.BUILD_DIR, 'db'),
    static : ['db/*']
  }
};

gulp.task('clean', function (fn) {
  rimraf(process.env.BUILD_DIR, fn);
});

// concatenates all the client scripts into one
gulp.task('build-client', function () {
  gulp.start('client-js-minify', 'client-css-minify', 'client-vendor', 'client-move');
});

// minify application code if necessary
gulp.task('client-js-minify', function () {
  return gulp.src(paths.client.scripts)
    .pipe(sourcemaps.init())
    .pipe(gulpif(PRODUCTION, uglify({ mangle : true })))
    .pipe(concat('app.min.js', { newLine: ';' }))
    .pipe(iife())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.client.dir));
});

gulp.task('client-css-minify', function () {
  return gulp.src(paths.client.styles)
    .pipe(concat('styles.min.css'))
    .pipe(gulpif(PRODUCTION, nano()))
    .pipe(gulp.dest(paths.client.dir));
});

gulp.task('client-vendor', function () {
  return gulp.src(paths.client.vendor)
    .pipe(gulpif(PRODUCTION, uglify({ mangle : true })))
    .pipe(concat('vendor.min.js', { newLine: ';'}))
    .pipe(gulp.dest(paths.client.dir));
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

// watch the client for changes and rebuild
gulp.task('watch', function () {
  gulp.watch(paths.client.scripts, ['build-client']);
  gulp.watch(paths.client.static, ['build-client']);
});

gulp.task('env', function () {
  gulp.src('.env')
    .pipe(gulp.dest(process.env.BUILD_DIR));
});

// build task for npm run start
gulp.task('build', ['clean'], function () {
  gulp.start('build-client', 'build-server', 'env');
});

// default task runner
gulp.task('default', ['clean'], function () {
  gulp.start('build-client', 'build-server', 'env', 'watch');
});
