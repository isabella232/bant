
module.exports = build;

var resolve = require('component-resolver');
var build = require('component-builder');

function build (component, opts, cb) {
  opts || (opts = {});

  resolve(component, opts, function (err, tree) {
    if (err) throw err;

    build.scripts(tree)
      .use('scripts', build.plugins.js())
      .use('scripts', build.plugins.json())
      .end(function (err, res) {
        if (err) throw err;

        var src = build.scripts.require + '\n';
        src += res;
        src += '\nrequire("' + build.scripts.canonical(tree).canonical + '");\n';

        cb(null, src);
      });

  });
}
