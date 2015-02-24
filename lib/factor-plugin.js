var path = require('path');
var fs = require('fs');
var xtend = require('xtend');
var defined = require('defined');
var factor = require('bant-factor');
var through = require('through2');
var pack = require('browser-pack');

module.exports = function (b, opts) {
  opts = xtend(opts, {
    basedir: defined(opts.basedir, process.cwd()),
    pack: xtend(opts, { raw: true, hasExports: true }),
    outputs: defined(opts.outputs, {}),
    resolveMap: defined(opts.resolveMap, {}),
    threshold: defined(opts.threshold, 1)
  });

  b.on('reset', reset);
  b.once('bant-ready', reset);
  
  function reset () {
    b._bpack.hasExports = true;

    var manifests = b._manifests, 
        exposeIndex = manifests.reduce(function (acc, x) {
          acc[x.expose] = x;
          return acc; 
        }, {}),
        frags = [];

    b.pipeline.get('record').push(through.obj(function (row, enc, cb) {
      if (row.file) {
        var manifest = exposeIndex[row.id];
        if (manifest && manifest._external) {
          manifest._row = row;
          frags.push(manifest);
        }
      }
      cb(null, row);
    }, function (cb) {
      frags.forEach(function (x) {
        var output = opts.outputs[x.name];
        if (output) {
          var ws = 'function' === typeof output
            ? output()
            : (isStream(output) ? output : fs.createWriteStream(output));

          var manifest = exposeIndex[x.expose];
          manifest._stream = pack(opts.pack);
          manifest._stream.pipe(ws);
        }
      });

      var fragsIx = frags.reduce(function (acc, x) {
        acc[x._row.file] = x;
        return acc;
      }, {});

      var s = factor({
        files: fragsIx,
        resolveMap: opts.resolveMap,
        threshold: opts.threshold
      });

      s.on('stream', function (x) { 
        x.pipe(fragsIx[x.file]._stream) 
      });

      b.pipeline.get('pack').unshift(s);

      cb();
    }));

    b.pipeline.get('label').push(through.obj(function (row, enc, cb) {
      opts.resolveMap[row.id] = path.resolve(opts.basedir, row.file);
      cb(null, row);
    }));
  }

  return b;
};

function isStream (s) { return s && typeof s.pipe === 'function' }
