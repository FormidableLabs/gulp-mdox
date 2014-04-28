var fs = require("fs"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  mdox = require("../mdox");

describe("mdox", function () {

  it("should handle no JS inputs", function (done) {
    var filePath = __dirname + "/fixtures/test.js",
      stream = mdox({
        name: "test.md"
      }),
      err;

    stream
      .on("error", function (err) {
        err = err;
      })
      .on("data", function (file) {
        expect(err).to.not.be.ok;
        console.log("TODO HERE RESULTS", file.path);
        console.log("TODO HERE RESULTS", file.contents.toString());
        done(err);
      })
      .end(new gutil.File({
        path: filePath,
        contents: fs.readFileSync(filePath)
      }));
  });

  it("should render JSDoc comments");
});
