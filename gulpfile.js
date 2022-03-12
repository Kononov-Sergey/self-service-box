const projectFolder = "dist";
const sourceFolder = "#src";

const path = {
  build: {
    html: `${projectFolder}/`,
    css: `${projectFolder}/css/`,
    js: `${projectFolder}/js/`,
    img: `${projectFolder}/img/`,
    fonts: `${projectFolder}/fonts/`,
  },
  src: {
    html: [`${sourceFolder}/*.html`, `!${sourceFolder}/#*.html`],
    css: `${sourceFolder}/scss/style.scss`,
    js: `${sourceFolder}/js/*.js`,
    img: `${sourceFolder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
    fonts: `${sourceFolder}/fonts/*.ttf`,
  },
  watch: {
    html: `${sourceFolder}/**/*.html`,
    css: `${sourceFolder}/scss/**/*.scss`,
    js: `${sourceFolder}/js/**/*.js`,
    img: `${sourceFolder}/img/**/*.{jpg, png, svg, gif, ico, webp}`,
  },
  clean: `./${projectFolder}/`,
  deploy: `./${projectFolder}/**/*`,
};
// Gulp
const { src, dest, parallel, series, task } = require("gulp");
const gulp = require("gulp");
// File handlers
const del = require("del");
const fileinclude = require("gulp-file-include");
const rename = require("gulp-rename");
// CSS
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const groupMedia = require("gulp-group-css-media-queries");
const cleanCss = require("gulp-clean-css");
const sourcemaps = require("gulp-sourcemaps");
// JS
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
// Sync wokr with project
const browsersync = require("browser-sync").create();
// Image
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const webpHtml = require("gulp-webp-html");
const webpCss = require("gulp-webpcss");
// GH pages
const deploy = require("gulp-gh-pages");

function browserSync() {
  browsersync.init({
    server: {
      baseDir: `./${projectFolder}/`,
    },
    port: 3000,
    notify: false,
  });
}

function htmlRender() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webpHtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream());
}

function cssRender() {
  return src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        outputStyle: "expanded",
      }).on("error", sass.logError)
    )
    .pipe(webpCss({ webpClass: ".webp", noWebpClass: ".no-webp" }))
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: ".min.css",
      })
    )
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream());
}

function jsRender() {
  return src(path.src.js)
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream());
}

function imageRender() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70,
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      })
    )
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream());
}

function watchFiles() {
  gulp.watch([path.watch.html], htmlRender);
  gulp.watch([path.watch.css], cssRender);
  gulp.watch([path.watch.js], jsRender);
  gulp.watch([path.watch.img], imageRender);
}

function cleanDist() {
  return del(path.clean);
}

// this is used to deploy the project to gh pages
task("deploy", function () {
  return gulp.src(path.deploy).pipe(deploy());
});

const build = series(
  cleanDist,
  imageRender,
  parallel(htmlRender, cssRender, jsRender)
);
const watch = parallel(build, watchFiles, browserSync);

exports.jsRender = jsRender;
exports.imageRender = imageRender;
exports.cssRender = cssRender;
exports.htmlRender = htmlRender;
exports.build = build;
exports.watch = watch;
exports.default = watch;
