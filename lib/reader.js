var inherits = require('util').inherits;
var path = require('path');
var fs = require('fs');
var events = require('events');
var defined = require('defined');
var JSONStream = require('JSONStream');
var through = require('through2');
var normalize = require('bant-normalize');

module.exports = Reader;
inherits(Reader, events.EventEmitter);

function Reader (opts) {
  if (!opts) opts = {};
  events.EventEmitter.call(this);
  this._options = opts;
  this._reset();
}

Reader.prototype.queue = function (file, opts) {
  this.empty = false;
  if (!opts) opts = {};

  if ('string' === typeof file) {
    var dirname = path.dirname(file);
    var basedir = defined(opts.basedir, this._options.basedir, dirname);
    file = path.resolve(basedir, file);
    this._streams.push(this._readFile(file).pipe(this._parse()));
    this._dirs[String(this._streams.length-1)] = dirname;
  } else if (isStream(file)) {
    if (!file._readableState.objectMode) {
      file = file.pipe(this._parse());
    }
    this._streams.push(file);
  } else if ('object' === typeof file) {
    this._objects.push(file);
  }
};

Reader.prototype._reset = function () {
  this._streams = [];
  this._objects = [];
  this._dirs = {};
  this._pending = 0;
  this.empty = true;
};

Reader.prototype._normalize = function () {
  var self = this,
      manifests = normalize(this._objects.map(function (obj) {
        obj.basedir = defined(obj.basedir, self._options.basedir, path.dirname(obj.main));
        return obj;
      }), this._options);
  this.emit('end', manifests);
  this._reset();
};

Reader.prototype.end = function () {
  var self = this;
  this._pending = this._streams.length;
  this._streams.forEach(function (s, i) {
    s.pipe(through.obj(function (row, enc, cb) {
      row.basedir = defined(row.basedir, self._dirs[String(i)]);
      self._objects.push(row);
      --self._pending;
      if (self._pending === 0) self._normalize();
      cb();
    }));
  });
};

Reader.prototype._parse = function () {
  var self = this,
      parse = JSONStream.parse();
  parse.on('error', function (err) { self.emit('error', err); });
  return parse;
};

Reader.prototype._readFile = function (file) {
  var self = this;
  var rs = fs.createReadStream(file);
  rs.on('error', function (err) { self.emit('error', err); });
  return rs;
};

function isStream (s) { return s && typeof s.pipe === 'function' }
