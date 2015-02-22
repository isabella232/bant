var xtend = require('xtend');
var fs = require('fs');
var Browserify = require('browserify');
var watchify = require('watchify');
var inherits = require('util').inherits;
var isarray = require('isarray');
var defined = require('defined');
var Reader = require('./lib/reader');
var concat = require('concat-stream');

exports = module.exports = Bant;
inherits(Bant, Browserify);

function Bant (files, opts) {
  if (!(this instanceof Bant)) return new Bant(files, opts);
  Browserify.call(this, files, opts);
  
  if (!opts) { opts = defined(this._options, {}) }

  this._reader = new Reader(opts);
  this._manifests = [];
}

Bant.prototype.use = function (file) {
  var self = this;
  if (isarray(file)) {
    file.forEach(function (x) { self.use(x); })
  } else { this._reader.queue(file) }
  return this;
};

Bant.prototype.bundle = function (cb) {
  var self = this;

  if (this._bundled) {
    var recorded = this._recorded;
    this.reset();
    recorded.forEach(function (x) {
      self.pipeline.write(x);
    });
  }

  if (cb) {
    this.pipeline.on('error', cb);
    this.pipeline.pipe(concat(function (body) {
      cb(null, body);
    }));
  }

  function _end () {
    if (self._pending === 0) {
      self.emit('bundle', self.pipeline);
      self.pipeline.end();
    } 
    else { 
      self.once('_ready', function () {
        self.emit('bundle', self.pipeline);
        self.pipeline.end();
      });
    }
  }

  if (!this._reader.empty) {
    this._reader.once('end', function (res) {
      self._manifests = res;
      res.forEach(function (x) {
        self.require(x._entry, {
          entry: true,
          expose: x.expose,
          basedir: x.basedir
        });
      });
      _end();
    });
    this._reader.end();
  } else _end();

  this._bundled = true;

  return this.pipeline;
};

exports.watch = function (files, opts) {
  if ('string' === typeof files || isarray(files) || isStream(files)) {
    b = new Bant(files, _xtend(opts));
  } else {
    b = new Bant(_xtend(files));
  }

  return watchify(b);

  function _xtend (obj) {
    return xtend(obj, watchify.args, { _watch: true });
  }
};

function isStream (s) { return s && typeof s.pipe === 'function' }
