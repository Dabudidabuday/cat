'use strict';
/**
  * @gulpfile {for practice}
  * browsersyncs on files changes and compiles scss to css (dist folder);
  * use "gulp watch" command to start;
  */

const { gulp, src, dest, series, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
// comst pump = require('pump');
const sass = require('gulp-sass');
const del = require('del');

function deleteDistFolder () {
  return del('dist');
}

function startBrowserSync () {
  browserSync.init({
    server: {
      baseDir: './'
    },
    open: false,
    notify: false,
    port: 3000
  });
}

/**
  * @method compileScss
  * @param source {String}
  * @param dist {String}
  */
function compileScss (source, dist) {
  return src(source)
    .pipe(sass().on('error', sass.logError))
    // .pipe(autoprefixer())
    .pipe(concat('main.css'))
    .pipe(dest(dist));
}

function buildApp () {
  let date = new Date();
  let page = 'App/Framework'; // todo param
  compileScss('app/scss/framework/index.scss', 'dist/App');
  return console.log (`${page} compiled successfully at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
}

function buildHomePage () {
  let date = new Date();
  let page = 'HomePage'; // todo param
  compileScss('app/scss/HomePage/index.scss', 'dist/HomePage');
  return console.log (`${page} compiled successfully at ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
}

function compileJs () {
  return src('app/js/index.js', { allowEmpty: true })
    .pipe(concat('main.js'))
    .pipe(dest('dist'))
}

// ---------------- BUILD PROJECT ---------------- //
async function buildProject () {
  buildApp();
  await buildHomePage();
}

function watchFiles () {
  startBrowserSync();

  watch('index.html').on('change', browserSync.reload);

  watch('app/scss/**/*.scss').on('change', series(buildProject, browserSync.reload));

  // watch('app/js/**/*.js').on('change', compileJs);
  // watch('dist/main.js').on('change', browserSync.reload);
}

exports.watch = series(buildProject, watchFiles);
