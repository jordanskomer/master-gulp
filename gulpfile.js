// =======
// initialize
// =======
const gulp          = require('gulp'),
      path          = require('path'),
      util          = require('gulp-util'),
      plumber       = require('gulp-plumber'),
      pug           = require('gulp-pug'),
      coffee        = require('gulp-coffee'),
      concat        = require('gulp-concat'),
      uglify        = require('gulp-uglify'),
      sass          = require('gulp-sass'),
      autoprefixer  = require('gulp-autoprefixer'),
      cleanCSS      = require('gulp-clean-css'),
      sourcemaps    = require('gulp-sourcemaps'),
      imagemin      = require('gulp-imagemin'),
      pngquant      = require('imagemin-pngquant'),
      gzip          = require('gulp-gzip'),
      rename        = require('gulp-rename'),
      replace       = require('gulp-replace'),
      notify        = require('gulp-notify'),
      sassLint      = require('gulp-sass-lint'),
      browserSync   = require('browser-sync').create(),
      config        = require('./gulp-config/config.json'),
      production    = !!util.env.production,
      prod_css_file = Date.now() + ".css",
      prod_js_file  = Date.now() + ".js";

// ======
// global vars
// ======
var error = false;

// ======
// functions
// ======

// notifyMessage
// -------
// Send a growl notification
//
// ==== Arguments
// [string] title           - the title of the growl notification
// [string] message         - the message to be displayed in the body of the growl notification
// [string] icon (optional) - relative file path to a png image
var notifyMessage = function (title, message, icon='') {
  notify({
    title: title,
    icon: icon ? path.join(__dirname, icon) : '',
    message: message,
  }).write('');
}

// reportError
// -------
// Export errors to console and send a growl notification stating the error
//
// ==== Arguments
// err - The gulp error
var reportError = function (err) {
  if (err.plugin) {
    console.log("=======\n\nGulp encountered an error when running " + util.colors.green(err.plugin)
            + '\n-------\nPlease correct the errors below\n');
  }
  if (err.message) {
    console.log(util.colors.red('Error(s)') + '\n' + err.message + '\n\n=======');
  }

  // Notification
  if (err.line && err.column) {
    var message = 'LINE ' + err.line + ':' + err.column + ' -- ';
  } else {
    var message = '';
  }
  notifyMessage('Error: ' + err.plugin, message + 'See console.', config.error_icon);
  error = true

  // Prevent the 'watch' task from stopping
  this.emit('end');
}

// =======
// gulp
// =======

// gulp browser-sync
// -------
// Runs browser-sync on the port specified in config.json
gulp.task('browser-sync', function() {
  if (!production) {
    browserSync.init(null, {
      proxy: "http://localhost:" + config.port,
      files: ["public/**/*.*"],
      browser: config.browser,
      port: config.port,
    });
  }
});

// gulp views
// -------
// Runs on pug/jade files. This essentially does nothing if you aren't using pug or jade. So. Use them.
// 1. Start Plumber
// 2. Convert pug/jade to html (if using pug or jade)
// 3. Stop Plumber
// 4. Save HTML
// 5. Reload Browser
// 6. Show notification (If no plumber error)
gulp.task('views', function() {
  if (config.use_pug) {
    return gulp.src(config.views_path[0])
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(pug())
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.views_path[1]))
      // .pipe(browserSync.reload)
      .on("end", function() {
        if (!error) {
          notifyMessage('gulp views', 'Pug/Jade Converted', config.views_icon);
        }
      });
  }
});

// gulp scripts
// -------
// Runs on all CoffeeScript and JS files in the path specified in the config array
// 1. Start sourcemaps
// 2. Start Plumber
// 3. Converts CoffeeScript to JS (if using coffeescript)
// 4. Concats all of the JS files into one file (name set in config)
// 5. Minifies the JS file (Only with gulp scripts --production)
// 6. Renames JS File to current timestamp (Only with gulp scripts --production)
// 7. Create sourcemaps
// 8. Stop Plumber
// 9. Saves the new file in the correct place
// 10. Reload Browser
// 11. Show notification (If no plumber error)
gulp.task('scripts', function() {
  return gulp.src(config.scripts_path[0])
    .pipe(plumber({
      errorHandler: reportError
    }))
    .pipe(sourcemaps.init())
    .pipe(config.use_coffee ? coffee() : util.noop())
    .pipe(concat(config.concat_file_name + ".js"))
    .pipe(production ? uglify(): util.noop())
    .pipe(production ? rename(prod_js_file) : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.scripts_path[1]))
    .pipe(plumber.stop())
    // .pipe(browserSync.reload)
    .on("end", function() {
      if (!error) {
        notifyMessage('gulp scripts', 'JS compiled', config.scripts_icon);
      }
    });
});

// gulp styles
// -------
// Runs on scss files and lints them, converts them, adds vendor prefixes, and combines them into on file
// 1. Start sourcemaps
// 2. Start Plumber
// 3. Lint SCSS - config is gound in gulp-config/linters
// 4. Convert SCSS to Compressed CSS
// 5. Add Vendor Prefixes
// 6. Minify the CSS (ONLY with gulp styles --production)
// 7. Rename to todays timestamp for cache busting (ONLY with gulp styles --production)
// 8. Create sourcemaps
// 9. Stop Plumber
// 10. Write to css file
// 11. Stream new css changes to browser
// 12. Show notification (If no plumber error)
gulp.task('styles', function () {
  return gulp.src(config.styles_path[0])
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: reportError
    }))
    .pipe(sassLint({
      configFile: path.join(__dirname, config.scss_linter)
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    .pipe(production ? cleanCSS() : util.noop())
    .pipe(production ? rename(prod_css_file) : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.styles_path[1]))
    .pipe(browserSync.stream())
    .on("end", function() {
      console.log("styles error: " + error);
      if (!error) {
        notifyMessage('gulp styles', 'SCSS compiled', config.styles_icon);
      }
    });
});

// gulp images
// -------
// Runs on all CoffeeScript and JS files in the path specified in the config array
// 1. Optimizes all images in the assets folder
// 2. Saves images in the production images folder
gulp.task('images', function() {
  if (production) {
    return gulp.src(config.images_path[0])
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(imagemin({
          progressive: true,
          use: [pngquant()]
        }))
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.images_path[1]))
      .on("end", function() {
        if (!error) {
          notifyMessage('gulp images', 'Images Optimized', config.images_icon);
        }
      });
  }
});

// gulp gzip
// -------
//
gulp.task('gzip', function() {
  if (production) {
    return gulp.src(config.gzip_path[0])
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(gzip())
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.gzip_path[1]))
      .on("end", function() {
        if (!error) {
          notifyMessage('gulp gzip', 'GZIP Completed', config.gzip_icon);
        }
      });
  }
});

// gulp set-prod-files
// -------
//
gulp.task('set-prod-files', function() {
  if (production) {
    return gulp.src(config.layout_file, { base: './' })
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(replace('link(rel="stylesheet", href="/assets/stylesheets/css/' + config.css_concat_file + '", type="text/css"',
                    'link(rel="stylesheet", href="/assets/stylesheets/css/' + prod_css_file + '", type="text/css"'))
      .pipe(replace('script(src="/assets/javascripts/' + config.js_concat_file + '")',
                    'script(src="/assets/javascripts/' + prod_js_file + '")'))
      .pipe(plumber.stop())
      .pipe(gulp.dest('./'))
  }
});

// gulp watch
// -------
//
gulp.task('watch', function() {
  gulp.watch(config.views_path[0], ['views']);
  gulp.watch(config.scripts_path[0], ['scripts']);
  gulp.watch(config.styles_path[0], ['styles']);
  gulp.watch(config.images_path[0], ['images']);
});

gulp.task('default', ['browser-sync', 'views', 'scripts', 'styles', 'images', 'gzip', 'watch']);
