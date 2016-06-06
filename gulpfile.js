var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var serve = require('gulp-serve');
var browserSync = require('browser-sync').create();

var pathConfigs = {
  build: './build',
  src: './src'
};

gulp.task('default', ['static-html', 'templates', 'js', 'less', 'serve']);

gulp.task('serve', function() {

    browserSync.init({
        server: pathConfigs.build
    });

    gulp.watch(pathConfigs.src + '/js/**/*.js', ['js']);
    gulp.watch(pathConfigs.src + '/index.html', ['static-html']);
    gulp.watch(pathConfigs.src + '/less/**/*.less', ['less']);
    gulp.watch(pathConfigs.src + '/pages/**/*.html', ['templates']);

    gulp.watch(pathConfigs.build).on('change', browserSync.reload);
});

gulp.task('less', function() {
  return gulp.src(pathConfigs.src + '/less/**/*.less')
   .pipe(less())
   .pipe(concat('style.css'))
   .pipe(gulp.dest(pathConfigs.build))
   .pipe(browserSync.stream());
});

gulp.task('js', function() {
  var jsSrcFiles = [
    pathConfigs.src + '/js/**/*.js'
  ];

  return gulp.src(jsSrcFiles)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(pathConfigs.build))
    .pipe(browserSync.stream());
});

gulp.task('static-html', function() {
  return gulp.src(pathConfigs.src + '/index.html')
    .pipe(gulp.dest(pathConfigs.build))
    .pipe(browserSync.stream());
});

gulp.task('templates', function() {
  return gulp.src(pathConfigs.src + '/pages/**/*.html')
    .pipe(gulp.dest(pathConfigs.build + '/pages'))
    .pipe(browserSync.stream());
});