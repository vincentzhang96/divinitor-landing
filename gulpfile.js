
var browserSync = require('browser-sync');
var del = require('del');
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var path = require('path');
var ts = require('gulp-typescript');
var tsProj = ts.createProject("tsconfig.json");

var paths = {
  images: "app/**/*.{png,svg,jpg}",
  styles: "app/resources/style/**/*.{css,less}",
  html: "app/**/*.{htm,html}",
  font: "app/**/*.{eot,ttf,woff,woff2}",
  video: "app/**/*.{mkv,mp4}",
  data: "app/**/*.data.*",
  ts: "app/ts/**/*.ts",
  source: "app",
  vendor: "vendor/**/*",
  tmp: ".tmp",
  build: "dist",
  tsOut: "resources/js"
};

// Optimize images and copy them to the build directory
gulp.task('images', function () {
  return gulp.src(paths.images)
    .pipe(plugins.cache(plugins.imagemin({ progressive: true, interlaced: true })))
    .pipe(gulp.dest(paths.build));
});

// Compile styles and copy them to the build directory.
gulp.task('styles', function () {
  return gulp.src(paths.styles)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({ paths: [path.join(__dirname, "app", "resources", "less-incl")] }))
    .pipe(plugins.autoprefixer({ browsers: [ 'ie >= 10', 'android >= 4.1' ] }))
    .pipe(gulp.dest('.tmp'))
    .pipe(plugins.csso())
    .pipe(gulp.dest(paths.build));
});

// Copy HTML to the build directory.
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.tmp))
    .pipe(plugins.minifyHtml())
    .pipe(gulp.dest(paths.build));
});

//  Copy fonts to the build directory.
gulp.task('font', function() {
  return gulp.src(paths.font)
  .pipe(gulp.dest(paths.build));
})

//  Copy videos to the build directory.
gulp.task('video', function() {
  return gulp.src(paths.video)
  .pipe(gulp.dest(paths.build));
})

//  Copy data to the build directory.
gulp.task('data', function() {
  return gulp.src(paths.data)
  .pipe(gulp.dest(paths.build));
})

//  Build TypeScript
gulp.task('tsbuild', function() {
  let tsResult = tsProj.src()
    .pipe(tsProj(ts.reporter.defaultReporter()));
  return tsResult.js.pipe(gulp.dest(path.join(paths.build, paths.tsOut)));
})

//  Copy vendor stuff
gulp.task('vendor', function() {
  return gulp.src(paths.vendor)
  .pipe(gulp.dest(paths.build));
});

// Remove the build directory.
gulp.task('clean', del.bind(null, [ paths.tmp, paths.build ], { dot: true }));

// Watch files for changes and reload the page in the browser when they do.
gulp.task('watch', [ 'images', 'styles', 'html', 'font', 'video', 'data', 'tsbuild', 'vendor' ], function() {
  browserSync({ notify: false, server: [ paths.tmp, paths.build ] });
  gulp.watch([ paths.html ], [ 'html', browserSync.reload ]);
  gulp.watch([ paths.styles ], [ 'styles', browserSync.reload ]);
  gulp.watch([ paths.font ], [ 'font', browserSync.reload ]);
  gulp.watch([ paths.video ], [ 'video', browserSync.reload ]);
  gulp.watch([ paths.data ], [ 'data', browserSync.reload ]);
  gulp.watch([ paths.ts ], [ 'tsbuild', browserSync.reload ]);
  gulp.watch([ paths.vendor ], [ 'vendor', browserSync.reload ]);
  gulp.watch([ paths.images ], browserSync.reload);
});

// Build the source and serve the result.
gulp.task('watch:build', [ 'build' ], function () {
  browserSync({ notify: false, server: 'build' });
});

// Build the source.
gulp.task('build', [ 'clean' ], function (callback) {
  runSequence([ 'images', 'styles', 'html', 'font', 'video', 'data', 'tsbuild', 'vendor' ], callback);
});

gulp.task('default', [ 'watch' ]);
