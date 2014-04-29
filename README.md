# [gulp](https://github.com/gulpjs/gulp)-mdox [![Build Status](https://secure.travis-ci.org/FormidableLabs/gulp-mdox.png?branch=master)](http://travis-ci.org/FormidableLabs/gulp-mdox)

> Convert JsDoc comments to Markdown.

## Install

Install with [npm](https://npmjs.org/package/gulp-mdox)

```
npm install --save-dev gulp-mdox
```

## Example

The JS source for `gulp-mdox` is read, converted to Markdown, and then inserted
into this [README.md](./README.md) document, overwriting the text sections
from `## API` to `## Other Tools`.

```js
var gulp = require("gulp"),
  mdox = require("gulp-mdox");

gulp.task("docs", function () {
  gulp
    .src("mdox.js")
    .pipe(mdox({
      src: "./README.md",
      name: "README.md",
      start: "## API",
      end: "## Other Tools"
    }))
    .pipe(gulp.dest("./"));
});
```

We eat our dog food!

Note that you don't actually need the `src`, `start` and `end` parameters if
all you want to do is generate a new / completely overwrite an existing
file.

## API

* [`exports(opts)`](#exports-opts-)

### `exports(opts)`
* **opts** (`Object`) Options
* **opts.name** (`String`) Output file name.
* **opts.src** (`String`) Input source markdown file. (_optional_)
* **opts.start** (`String`) Start marker. (_optional_)
* **opts.end** (`String`) End marker. (_optional_)

JsDoc-to-Markdown plugin.

Extract JsDoc comments and convert to Markdown.

## Other Tools

Other alternative tools:

* [gulp-markdox](https://github.com/gberger/gulp-markdox):
  [markdox](https://github.com/cbou/markdox) plugin for gulp
