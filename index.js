var plugin = require('bant-plugin');
var xtend = require('xtend');
var Browserify = require('browserify');
var watchify = require('watchify');
var inherits = require('util').inherits;

exports = module.exports = Bant;
inherits(Bant, Browserify);

function Bant (files, opts) {
  if (!(this instanceof Bant)) return new Bant(files, opts);
  Browserify.call(this, files, opts);
  this.plugin(plugin, opts);
}

Bant.prototype.use = function (s) {
  this.emit('config', s);
  return this;
};

exports.watch = function (files, opts) {
  if ('string' === typeof files || Array.isArray(files) ||
      (files && 'function' === typeof files.pipe)) {
    b = new Bant(files, _xtend(opts));
  } else {
    b = new Bant(_xtend(files));
  }

  return watchify(b);

  function _xtend (obj) {
    return xtend(obj, watchify.args, { _watch: true });
  }
};