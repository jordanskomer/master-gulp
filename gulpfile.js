// =======
// initialize
// =======
const gulp          = require('gulp'),
      path          = require('path'),
      util          = require('gulp-util'),
      plumber       = require('gulp-plumber'),
      pug           = require('gulp-pug'),
      haml          = require('gulp-haml'),
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
      sasslint      = require('gulp-sass-lint'),
      coffeelint    = require('gulp-coffeelint'),
      clintstyle    = require('coffeelint-stylish'),
      browserSync   = require('browser-sync').create(),
      config        = require('./gulp-config/config.json'),
      production    = !!util.env.production,
      prod_css_file = Date.now() + ".css",
      prod_js_file  = Date.now() + ".js",
      views_path    = config.views_path["start_path"] + (config.use_pug ? "/**/*.{pug,jade}" : "/**/*.haml"),
      scripts_path  = config.scripts_path["start_path"] + (config.use_coffee ? "/**/*.coffee" : "/**/*.js"),
      scss_path     = config.scss_path["start_path"] + "/**/*.scss",
      images_path   = config.images_path["start_path"] + "/**/*.{png,jpg,jpeg,JPEG,gif}",
      gzip_path     = config.gzip_path["start_path"] + "**/*.{html,xml,json,css,js}";

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
  notifyMessage('Error: ' + err.plugin, message + 'See console.', '/gulp-config/icons/error.png');

  // Prevent the 'watch' task from stopping
  // this.emit('end');
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

// gulp scss-lint
// -------
//
gulp.task('scss-lint', function() {
  return gulp.src(scss_path)
    .pipe(sasslint({
      configFile: path.join(__dirname, config.scss_linter)
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError())
    .on('error', function(e) {
      reportError(e);
    })
});

// gulp coffee-lint
// -------
//
gulp.task('coffee-lint', function() {
  if (config.use_coffee) {
    return gulp.src(scripts_path)
      .pipe(coffeelint(path.join(__dirname, config.coffee_linter)))
      .pipe(coffeelint.reporter('coffeelint-stylish'))
      .pipe(coffeelint.reporter('fail'))
      .on('error', function(e) {
        reportError(e);
      })
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
  if (config.use_html_templating) {
    return gulp.src(views_path)
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(config.use_pug ? pug() : util.noop())
      .pipe(config.use_haml ? haml() : util.noop())
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.views_path["end_path"]))
      .on('end', function() {
        notifyMessage('gulp views',
          config.use_pug ? 'Pug/Jade Converted' : 'Haml Converted',
          config.use_pug ? '/gulp-config/icons/pug.png' : '/gulp-config/icons/haml.png')
      });
  }
});

// gulp scripts
// -------
// Runs after coffee-lint on all CoffeeScript or JS files in the path specified in the config array
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
gulp.task('scripts', ['coffee-lint'], function() {
  return gulp.src(scripts_path)
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: reportError
    }))
    .pipe(config.use_coffee ? coffee() : util.noop())
    .pipe(concat(config.concat_file_name + ".js"))
    .pipe(production ? uglify(): util.noop())
    .pipe(production ? rename(prod_js_file) : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.scripts_path["end_path"]))
    .pipe(plumber.stop())
    .on('end', function() {
      notifyMessage('gulp scripts', 'JS compiled', '/gulp-config/icons/coffeescript.png')
    });
});

// gulp styles
// -------
// Runs after scss-lint on scss files converts them, adds vendor prefixes, and combines them into on file
// 1. Start sourcemaps
// 2. Start Plumber
// 3. Convert SCSS to Compressed CSS
// 4. Add Vendor Prefixes
// 5. Minify the CSS (ONLY with gulp styles --production)
// 6. Rename to todays timestamp for cache busting (ONLY with gulp styles --production)
// 7. Create sourcemaps
// 8. Stop Plumber
// 9. Write to css file
// 10. Stream new css changes to browser
// 11. Show notification (If no plumber error)
gulp.task('styles', ['scss-lint'], function () {
  return gulp.src(scss_path)
    .pipe(sourcemaps.init())
    .pipe(plumber({
      errorHandler: reportError
    }))
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    .pipe(production ? cleanCSS() : util.noop())
    .pipe(production ? rename(prod_css_file) : util.noop())
    .pipe(sourcemaps.write('.'))
    .pipe(plumber.stop())
    .pipe(gulp.dest(config.styles_path["end_path"]))
    .pipe(browserSync.stream())
    .on('end', function() {
      notifyMessage('gulp styles', 'SCSS compiled', '/gulp-config/icons/sass.png')
    });
});

// gulp images
// -------
// Runs on all CoffeeScript and JS files in the path specified in the config array
// 1. Optimizes all images in the assets folder
// 2. Saves images in the production images folder
gulp.task('images', function() {
  if (production) {
    return gulp.src(images_path)
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(imagemin({
          progressive: true,
          use: [pngquant()]
        }))
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.images_path["end_path"]))
      .on('end', function() {
        notifyMessage('gulp images', 'Images Optimized', '/gulp-config/icons/image.png')
      });
  }
});

// gulp gzip
// -------
//
gulp.task('gzip', function() {
  if (production) {
    return gulp.src(gzip_path)
      .pipe(plumber({
        errorHandler: reportError
      }))
      .pipe(gzip())
      .pipe(plumber.stop())
      .pipe(gulp.dest(config.gzip_path["end_path"]))
      .on('end', function() {
        notifyMessage('gulp gzip', 'GZIP Completed', '/gulp-config/icons/gzip.png')
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
  gulp.watch(views_path, ['views'], browserSync.reload);
  gulp.watch(scripts_path, ['scripts'], browserSync.reload);
  gulp.watch(scss_path, ['styles']);
  gulp.watch(images_path, ['images']);
});

gulp.task('default', ['browser-sync', 'views', 'scripts', 'styles', 'images', 'gzip', 'watch']);
