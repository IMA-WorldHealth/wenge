var gulp      = require('gulp'),
    gulpif    = require('gulp-if'),
    concat    = require('gulp-concat'),
    uglify    = require('gulp-uglify');

// toggle to minify scripts
var MINIFY = false;

var modules = ['client/modules/app.js', 'client/modules/**/*.js'];

// concatenates all the client scripts into one
gulp.task('build-client', function () {
  return gulp.src(modules)
    .pipe(gulpif(MINIFY, uglify()))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('client/'));
});

gulp.task('watch', function () {
  gulp.watch(modules, ['build-client']);
});

// default task runner
gulp.task('default', [], function () {
  gulp.start('build-client', 'watch');
});
