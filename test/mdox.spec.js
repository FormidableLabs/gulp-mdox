var fs = require("fs"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  mdox = require("../mdox"),

  expectedTest = fs.readFileSync(__dirname + "/expected/test.md").toString();

describe("mdox", function () {

  it("should handle no JS inputs", function (done) {
    var stream = mdox({
        name: "nowhere.md"
      }),
      count = 0,
      err;

    stream
      .on("error", function (err) {
        err = err;
      })
      .on("data", function (file) {
        count++;
        expect(file.contents.toString()).to.equal("");
      })
      .on("end", function (err) {
        expect(err).to.not.be.ok;
        done(err);
      })
      .end(new gutil.File({
        path: "nowhere.md",
        contents: new Buffer("var foo = 42;")
      }));
  });

  it("should JS to new file", function (done) {
    var filePath = __dirname + "/fixtures/test.js",
      stream = mdox({
        name: "test.md"
      }),
      count = 0,
      err;

    stream
      .on("error", function (err) {
        err = err;
      })
      .on("data", function (file) {
        count++;
        expect(file.contents.toString()).to.equal(expectedTest);
      })
      .on("end", function (err) {
        expect(err).to.not.be.ok;
        done(err);
      })
      .end(new gutil.File({
        path: filePath,
        contents: fs.readFileSync(filePath)
      }));
  });

  it("should render JSDoc comments");
});
