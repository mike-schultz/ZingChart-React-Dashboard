var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

gulp.task('build', function(){
  browserify({
    entries: ['./src/js/App.js'],
    transform: [reactify],
  })
    .bundle()
    .pipe(source('build.min.js'))
    //.pipe(streamify(uglify('build.min.js')))
    .pipe(gulp.dest('dist'));
});

gulp.task('replaceHTML', function(){
  gulp.src('src/index.html')
    .pipe(htmlreplace({'js': 'build.min.js'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['replaceHTML', 'build']);
