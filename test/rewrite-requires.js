var bant = require('..');
var test = require('tape');
var vm = require('vm');

test('rewrite requires', function (t) {
  t.plan(1);
  bant(__dirname + '/rewrite-requires/y.js', 
  { 
    basedir: __dirname + '/rewrite-requires',
    rewriteMap: { qux: './y/z', x: './x/bar.js' }
  }).bundle(function (err, src) {
    if (err) throw err;
    vm.runInNewContext(src, {
      console: { 
        log: function (n) {
          t.equal(n, 556);
        }
      }
    });
  });
});