//---------------------------------------------------------------------
//plugins
//---------------------------------------------------------------------

var gulp          = require("gulp"),
    sass          = require("gulp-sass"),
    concat        = require("gulp-concat"),
    watch         = require("gulp-watch"),
    plumber       = require("gulp-plumber"),
    minify_css    = require("gulp-clean-css"),
    uglify        = require("gulp-uglify"),
    sourcemaps    = require("gulp-sourcemaps"),
    notify        = require("gulp-notify"),
    prefix        = require("gulp-autoprefixer"),
    imagemin      = require("gulp-imagemin"),
    jshint        = require("gulp-jshint"),
    pngquant      = require("imagemin-pngquant"),
    browserSync   = require("browser-sync")

//---------------------------------------------------------------------
//Settings
//---------------------------------------------------------------------

var src = {
  sass: "src/sass/**/*.scss",
  js: "src/js/**/*.jss",
  img: "src/img/*"
}

var output = {
  js: "output/js",
  css: "output/css",
  img: "output/img",
  html: "output/**/*.html",
  min_css: "app.min.css",
  min_js: "app.min.js"
}
//---------------------------------------------------------------------
//Error Handler
//---------------------------------------------------------------------

var onError = function(err) {
  console.log(err);
  this.emit('end');
}


//---------------------------------------------------------------------
//Task: Sass
//---------------------------------------------------------------------

gulp.task('sass', function() {

    return gulp.src(src.sass)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(prefix('last 2 versions'))
        .pipe(concat(output.min_css))
        .pipe(gulp.dest(output.css))
        .pipe(minify_css())
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.css))
        .pipe(browserSync.reload({stream: true}));
});



//---------------------------------------------------------------------
//Task: JS
//---------------------------------------------------------------------

gulp.task('js', function() {

    return gulp.src(src.js)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(uglify())
        .pipe(concat(output.min_js))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.js))
        .pipe(browserSync.reload({stream: true}));

});


//---------------------------------------------------------------------
//Task: Image
//---------------------------------------------------------------------

gulp.task('img', function() {
  return gulp.src(src.img)
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(output.img));
});


//---------------------------------------------------------------------
//Task: Watch
//---------------------------------------------------------------------

gulp.task('watch', function() {
    browserSync.init({
        // proxy: 'localhost',
        server: './output'
    });
    gulp.watch(src.js, ['js']);
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.img, ['img']);
    gulp.watch(output.html).on('change', browserSync.reload);
});

//---------------------------------------------------------------------
//Task: Default
//---------------------------------------------------------------------
gulp.task('default', ['watch', 'sass', 'img', 'js']);
