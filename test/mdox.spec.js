var fs = require("fs"),

  chai = require("chai"),
  expect = chai.expect,

  gutil = require("gulp-util"),
  mdox = require("../mdox"),

  _readFixture = function (name) {
    return fs.readFileSync(__dirname + "/" + name).toString();
  },

  fixtureJs = _readFixture("fixtures/test.js"),
  //fixtureExisting = _readFixture("fixtures/existing.md"),
  expectedTest = _readFixture("expected/test.md");
  //expectedExisting = _readFixture("expected/existing.md");

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
      .on("end", function () {
        expect(err).to.not.be.ok;
        done(err);
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
      err;

    stream
      .on("error", function (err) {
        err = err;
      })
      .on("data", function (file) {
        count++;
        expect(file.contents.toString()).to.equal(expectedTest);
      })
      .on("end", function () {
        expect(err).to.not.be.ok;
        done(err);
      })
      .end(new gutil.File({
        contents: new Buffer(fixtureJs)
      }));
  });

  // it("should render JS to existing file", function (done) {
  //   var stream = mdox({
  //       src: __dirname + "/fixtures/existing.md",
  //       name: "existing.md"
  //     }),
  //     count = 0,
  //     err;

  //   stream
  //     .on("error", function (err) {
  //       err = err;
  //     })
  //     .on("data", function (file) {
  //       count++;
  //       expect(file.contents.toString()).to.equal(expectedExisting);
  //     })
  //     .on("end", function (err) {
  //       expect(err).to.not.be.ok;
  //       done(err);
  //     })
  //     .end(new gutil.File({
  //       contents: new Buffer(fixtureJs)
  //     }));
  // });
});
