var gulp      = require('gulp'),
    gulpif    = require('gulp-if'),
    concat    = require('gulp-concat'),
    rimraf    = require('rimraf'),
    uglify    = require('gulp-uglify');

// toggle to minify scripts
var MINIFY = false,
    OUT = './bin/';

var paths = {
  client : {
    scripts: ['client/modules/app.js', 'client/modules/**/*.js'],
    static : ['!client/*.js', '!client/**/*.js', 'client/*', 'client/**/*']
  },
  server : { 
    scripts : ['server/*.js', 'server/**/*.js'],
    static : ['server/*', 'server/**/*']
  }
};

gulp.task('clean', function (fn) {
  rimraf(OUT, fn);
});

// concatenates all the client scripts into one
gulp.task('build-client', function () {
  gulp.start('client-minify', 'client-move');
});

gulp.task('client-minify', function () {
  return gulp.src(paths.client.scripts)
    .pipe(gulpif(MINIFY, uglify()))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest(OUT + 'client/'));
});

// move the client into the bin directory
gulp.task('client-move', function () {
  return gulp.src(paths.client.static)
    .pipe(gulp.dest(OUT + 'client/'));
});

gulp.task('build-server', function () {
  gulp.start('server-move');
});

// move the server into the bin/ directory
gulp.task('server-move', function () {
  return gulp.src(paths.server.static)
    .pipe(gulp.dest(OUT + 'server/'));
});

// watch the client for changes and rebuild
gulp.task('watch', function () {
  gulp.watch(paths.client.scripts, ['build-client']);
  gulp.watch(paths.client.static, ['build-client']);
});

// build task for npm run start 
gulp.task('build', ['clean'], function () {
  gulp.start('build-client', 'build-server');
});

// default task runner
gulp.task('default', ['clean'], function () {
  gulp.start('build-client', 'build-server', 'watch');
});
