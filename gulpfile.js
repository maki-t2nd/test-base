var gulp      = require('gulp')
, webserver   = require('gulp-webserver')
, jade        = require('gulp-jade')
, compass     = require('gulp-compass')
, prefix      = require('gulp-autoprefixer')
, rimraf      = require('gulp-rimraf')
, plumber     = require('gulp-plumber')
, runSequence = require('run-sequence');

var config = require('./src/config.json');

// サーバー
gulp.task('server', function() {
  return gulp.src('./dest/')
  .pipe(webserver({
    livereload: true
  }));
});

// html生成
gulp.task('jade', function() {
  return gulp.src('src/**/[a-zA-Z0-9]*.jade')
  .pipe(plumber())
  .pipe(jade({
    pretty: true,
    basedir: 'src',
    locals: config
  }))
  .pipe(gulp.dest('dest'));
});

// css生成
gulp.task('compass', function() {
  return gulp.src('src/sass/**/*.scss')
  .pipe(plumber())
  .pipe(compass({
    config_file: 'src/config.rb',
    style: 'expanded',
    css: 'dest/css/',
    sass: 'src/sass/',
    image: 'src/images/',
    import_path: ['bower_components']
  }))
  .pipe(prefix('last 2 version', 'ie 9', 'ie 8', 'ie 7'))
  .pipe(gulp.dest('dest/css/'));
});

// jsコピー
gulp.task('js', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jquery-easing/jquery.easing.js',
    'bower_components/underscore/underscore.js',
    'src/js'
  ])
  .pipe(gulp.dest('dest/js'));
});

// imgコピー
gulp.task('image', function() {
  return gulp.src('src/images')
  .pipe(gulp.dest('dest/images'));
});

// dest削除
gulp.task('clean', function() {
  return gulp.src('dest/')
  .pipe(rimraf());
});

// 監視
gulp.task('watch', function() {
  gulp.watch(['src/**/*.jade', 'src/config.json'], ['jade']);
  gulp.watch('src/sass/**/*.scss', ['compass']);
});


gulp.task('default', function() {
  runSequence('clean', ['jade', 'compass', 'js', 'image'], ['watch', 'server']);
});

gulp.task('build', function() {
  runSequence('clean', ['jade', 'compass', 'js', 'image']);
});