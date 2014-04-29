/*jshint unused: false */
/**
 * Say hello.
 *
 * Say your name and age.
 *
 * ```html
 * <em>Hello!</em>
 * ```
 *
 * @param {String} name Your name.
 * @param {Number} age  Your age. (_optional_)
 * @see http://example.com
 * @api public
 */
var hello = function (name, age) {
  return "Hello " + name + "!";
};

/**
 * Say goodbye.
 *
 * Say your name and age.
 *
 * @param {String} name Your name.
 * @returns {String} A fond farewell.
 * @see http://example.com
 * @api public
 */
var goodbye = function (name) {
  return "Goodbye " + name + "!";
};

/**
 * No args.
 *
 * @api public
 */
var noArgs = function () {
  return "No arguments!";
};
