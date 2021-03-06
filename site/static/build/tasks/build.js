var gulp = require('gulp');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var paths = require('../paths');
var assign = Object.assign || require('object.assign');
var notify = require('gulp-notify');
var typescript = require('gulp-typescript');
var options = require('../../tsconfig.json').compilerOptions;

// transpiles changed es6 files to SystemJS format
// the plumber() call prevents 'pipe breaking' caused
// by errors from other gulp plugins
// https://www.npmjs.com/package/gulp-plumber
gulp.task('build-system', function() {
  return gulp.src(paths.dtsSrc.concat(paths.source))
    .pipe(plumber())
    .pipe(sourcemaps.init({loadMaps: false}))
    .pipe(typescript(options))
    .pipe(sourcemaps.write({includeContent: true, sourceRoot: '/src'}))
    .pipe(gulp.dest(paths.output));
});

// copies changed html files to the output directory
gulp.task('build-html', function() {
  return gulp.src(paths.html)
    .pipe(changed(paths.output, {extension: '.html'}))
    .pipe(gulp.dest(paths.output));
});

// compiles sass to css with sourcemaps
gulp.task('build-css', function () {
    return gulp.src(paths.style)
      .pipe(plumber())
      .pipe(changed(paths.style, { extension: '.css' }))
      .pipe(sourcemaps.init())
      .pipe(sass({ includePaths: ['./jspm_packages/github/twbs/bootstrap-sass@3.3.6/assets/stylesheets'] }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.output + '/styles'));
});

// this task calls the clean task (located
// in ./clean.js), then runs the build-system
// and build-html tasks in parallel
// https://www.npmjs.com/package/gulp-run-sequence
gulp.task('build', function(callback) {
  return runSequence(
    'clean',
    ['build-system', 'build-html', 'build-css'],
    callback
  );
});