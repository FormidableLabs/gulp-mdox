var fs = require("fs"),
  es = require("event-stream"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  mdox = require("../mdox"),

  _readFixture = function (name) {
    return fs.readFileSync(__dirname + "/" + name).toString();
  },

  fixtureJs = _readFixture("fixtures/test.js"),
  expectedTest = _readFixture("expected/test.md"),
  expectedExisting = _readFixture("expected/existing.md");

describe("mdox", function () {

  it("should handle no JS inputs", function (done) {
    var stream = mdox({
        name: "nowhere.md"
      }),
      count = 0,
      error;

    stream
      .on("error", function (err) {
        error = err;
      })
      .on("data", function (file) {
        count++;
        expect(file.contents.toString()).to.equal("");
      })
      .on("end", function () {
        expect(error).to.not.be.ok;
        done(error);
      })
      .end(new gutil.File({
        path: "nowhere.md",
        contents: new Buffer("var foo = 42;")
      }));
  });

  it("should render JS to new file", function (done) {
    var stream = mdox({
        name: "test.md"
      }),
      count = 0,
      error;

    stream
      .on("error", function (err) {
        error = err;
      })
      .on("data", function (file) {
        count++;
        expect(file.contents.toString()).to.equal(expectedTest);
      })
      .on("end", function () {
        expect(error).to.not.be.ok;
        done(error);
      })
      .end(new gutil.File({
        contents: new Buffer(fixtureJs)
      }));
  });

  it.skip("should render JS to existing file", function (done) {
    var stream = mdox({
        src: __dirname + "/fixtures/existing.md",
        name: "existing.md",
        start: "## Before",
        end: "## After"
      }),
      error;

    stream
      .on("error", function (err) {
        error = err;
      })
      .write(new gutil.File({
        contents: new Buffer(fixtureJs)
      }));

    stream
      .pipe(es.through(function (file) {
        // Pipe to through stream to fully resolve.
        expect(error).to.not.be.ok;
        console.log(file.contents.toString());
        //expect(file.contents.toString()).to.equal(expectedExisting);
        done(error);
      }));
  });
});
