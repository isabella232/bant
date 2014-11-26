
module.exports = build;

var browserify = require('browserify');

function build (files, opts, cb) {
  opts || (opts = {});

  browserify(files, opts)
    .bundle(cb);
}
