/**
 * Gulp file.
 */
var fs = require("fs"),
  gulp = require("gulp"),
  jshint = require("gulp-jshint"),
  mocha = require("gulp-mocha"),
  mdox = require("./mdox");

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------
// Strip comments from JsHint JSON files (naive).
var _jshintCfg = function (name) {
  var raw = fs.readFileSync(name).toString();
  return JSON.parse(raw.replace(/\/\/.*\n/g, ""));
};

// ----------------------------------------------------------------------------
// JsHint
// ----------------------------------------------------------------------------
gulp.task("jshint", function () {
  gulp
    .src([
      "test/**/*.js",
      "*.js"
    ])
    .pipe(jshint(_jshintCfg(".jshintrc.json")))
    .pipe(jshint.reporter("default"))
    .pipe(jshint.reporter("fail"));
});

// ----------------------------------------------------------------------------
// Mocha
// ----------------------------------------------------------------------------
gulp.task("test", function () {
  gulp
    .src([
      "test/**/*.spec.js"
    ])
    .pipe(mocha({
      reporter: "spec"
    }));
});

// ----------------------------------------------------------------------------
// Docs
// ----------------------------------------------------------------------------
gulp.task("docs", function () {
  gulp
    .src([
      "mdox.js"
    ])
    .pipe(mdox({
      src: "./README.md",
      name: "README.md",
      start: "## API",
      end: "## Other Tools"
    }))
    .pipe(gulp.dest("./"));
});

// ----------------------------------------------------------------------------
// Aggregated Tasks
// ----------------------------------------------------------------------------
gulp.task("check",      ["jshint", "test"]);
gulp.task("default",    ["check"]);
