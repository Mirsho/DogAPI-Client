'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
const jsdoc = require('gulp-jsdoc3');
const eslint = require('gulp-eslint');

sass.compiler = require('node-sass');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function () {
  return gulp.src("./style/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./style"))
    .pipe(browserSync.stream());
});

gulp.task('doc', function (cb) {
  const config = require('./jsdocCustom.json');
  gulp.src(['README.md', './js/*.js'], { read: false })
    .pipe(jsdoc(config, cb));
});

gulp.task('lint', () => {
  return gulp.src(['./js/*.js'])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

// Static Server + watching scss/html files
gulp.task('serve', gulp.series(['sass'], gulp.series(['doc']), function () {

  browserSync.init({
    server: "./"
  });

  gulp.watch("./style/*.scss", gulp.series(['sass']));
  gulp.watch('./js/*.js', gulp.series(['doc']));
  //Quité la tarea lint de la llamada inicial porque detenía las tareas watch
  gulp.watch('./js/*.js', gulp.parallel(['lint']));
  gulp.watch("./*.html").on('change', browserSync.reload);
  gulp.watch("./js/*.js").on('change', browserSync.reload);
}));

gulp.task('default', gulp.series(['serve']));

//!Nueva sintaxis
/*
const { watch, series } = require('gulp');
const { sass } = require('gulp-sass');

sass.compiler = require('node-sass');

function sass(cb) {
  return gulp.src('./style/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./style'));
}

function clean(cb) {
  // body omitted
  cb();
}

function javascript(cb) {
  // body omitted
  cb();
}

function css(cb) {
  // body omitted
  cb();
}

exports.default = function() {
  // You can use a single task
  watch('src/*.css', css);
  // Or a composed task
  watch('src/*.js', series(clean, javascript));
};
*/