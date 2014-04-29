var fs = require("fs"),
  _ = require("lodash"),
  dox = require("dox"),
  ejs = require("ejs"),

  es = require("event-stream"),
  gutil = require("gulp-util"),
  PluginError = gutil.PluginError,
  PLUGIN_NAME = "gulp-mdox",

  tmplPath = __dirname + "/templates";

// Read and process a single template.
var _readTmpl = function (tmplPath) {
  var text = fs.readFileSync(tmplPath)
    .toString()
    .replace(/^\s*|\s*$/g, "");

  return ejs.compile(text);
};

// Get and compile templates.
// **Note**: Extend to take template options in the future.
var _getTmpl = _.memoize(function () {
  return _.chain(["toc", "heading", "section"])
    .map(function (name) {
      // Convert to name, name.ujs compiled template pairs.
      return [name, _readTmpl(tmplPath + "/" + name + ".ejs")];
    })
    .object()
    .value();
});

/**
 * A section / function of documentation.
 *
 * @param {Object} obj Objectified underlying data.
 */
var Section = function (data) {
  this.data = data;
  this.tmpl = _getTmpl();
};

Section.prototype.isPublic = function () {
  var data = this.data;
  return !data.isPrivate && !data.ignore && _.any(data.tags, function (t) {
    return t.type === "api" && t.visibility === "public";
  });
};

Section.prototype.heading = function () {
  var params = _.chain(this.data.tags)
    // Limit to params without a `.` (like `opts.foo`).
    .filter(function (t) {
      return t.type === "param" && t.name.indexOf(".") === -1;
    })
    .map(function (t) {
      var isOpt = t.description.indexOf("_optional_") !== -1;
      return isOpt ? "[" + t.name + "]" : t.name;
    })
    .value()
    .join(", ");

  return this.tmpl.heading({
    name: this.data.ctx.name,
    params: params ? "(" + params + ")" : null
  });
};

// Memoize.
Section.prototype.heading = _.memoize(
  Section.prototype.heading, function () { return this.data.ctx.name; });

Section.prototype.headingId = function () {
  return this.heading().toLowerCase().replace(/[^\w]+/g, "-");
};

Section.prototype.renderToc = function () {
  return this.tmpl.toc({
    heading: this.heading(),
    id: this.headingId()
  });
};

Section.prototype.renderSection = function () {
  return this.tmpl.section(_.extend({
    heading: this.heading()
  }, this.data));
};

/**
 * Generate MD API from `dox` object.
 */
var _generateMdApi = function (obj) {
  var toc = [];

  // Finesse comment markdown data.
  // Also, statefully create TOC.
  var sections = _.chain(obj)
    .map(function (data) { return new Section(data); })
    .filter(function (s) { return s.isPublic(); })
    .map(function (s) {
      toc.push(s.renderToc());  // Add to TOC.
      return s.renderSection(); // Render section.
    })
    .value()
    .join("\n");

  // No Output if not sections.
  if (!sections) {
    return "";
  }

  return "\n" + toc.join("") + "\n" + sections;
};

/**
 * JsDoc-to-Markdown plugin.
 *
 * Extract JsDoc comments and convert to Markdown.
 *
 * @param {Object} opts       Options
 * @param {String} opts.name  Output file name.
 * @param {String} opts.src   Input source markdown file. (_optional_)
 * @param {String} opts.start Start marker. (_optional_)
 * @param {String} opts.end   End marker. (_optional_)
 * @api public
 */
module.exports = function (opts) {
  // Set up options.
  opts = _.extend({
    src: null,
    start: null,
    end: null
  }, opts);

  // Validate.
  if (!opts.name) {
    throw new PluginError(PLUGIN_NAME, "Name is required");
  }

  // Convert object.
  var convert = {
    // Internal buffer
    _buffer: [],

    // DATA: Buffer incoming `src` JS files.
    buffer: function (file) {
      if (file.isBuffer()) {
        convert._buffer.push(file.contents.toString("utf8"));
      } else if (file.isStream()) {
        return this.emit("error",
          new PluginError(PLUGIN_NAME, "Streams are not supported!"));
      }
    },

    // END: Convert to Markdown format and pass on to destination stream.
    toDocs: function () {
      var data = dox.parseComments(convert._buffer.toString(), { raw: true });
      var mdApi = _generateMdApi(data);

      // Just use MD straight up if no destination insertion.
      var contents = opts.src ?
        convert.insertTextStream(mdApi) :
        new Buffer(mdApi ? mdApi + "\n" : "");

      this.emit("data", new gutil.File({
        path: opts.name,
        contents: contents
      }));

      this.emit("end");
    },

    // Create stream for destination and insert text appropriately.
    insertTextStream: function (text) {
      var inApiSection = false;

      return fs.createReadStream(opts.src)
        .pipe(es.split("\n"))
        .pipe(es.through(function (line) {
          // Hit the start marker.
          if (line === opts.start) {
            // Emit our line (it **is** included).
            this.emit("data", line);

            // Emit our the processed API data.
            this.emit("data", text);

            // Mark that we are **within** API section.
            inApiSection = true;
          }

          // End marker.
          if (line === opts.end) {
            // Mark that we have **exited** API section.
            inApiSection = false;
          }

          // Re-emit lines only if we are not within API section.
          if (!inApiSection) {
            this.emit("data", line);
          }
        }))
        .pipe(es.join("\n"))
        .pipe(es.wait());
    }
  };

  return es.through(convert.buffer, convert.toDocs);
};
