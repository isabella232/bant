var test = require('tape');
var bant = require('..');
var os = require('os');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var vm = require('vm');
var concat = require('concat-stream');

var tmpdir = path.join((os.tmpdir || os.tmpDir)(), 'bant-' + Math.random());
var xfile = path.join(tmpdir, 'x.js');
var yfile = path.join(tmpdir, 'y.js');
var zfile = path.join(tmpdir, 'z.js');

mkdirp.sync(tmpdir);
fs.writeFileSync(xfile, "var z = require('./z'); console.log(z+1);");
fs.writeFileSync(yfile, "var z = require('./z'); console.log(z+2);");
fs.writeFileSync(zfile, "module.exports = 555");

test('factor-watch', function (t) {
  t.plan(8);

  var i = 0;

  var b = bant.watch({ 
    factor: true,
    outputs: {
      x: check.bind(null, 'x'),
      y: check.bind(null, 'y')
    }
  });

  b.use([
    { name: 'x', main: xfile },
    { name: 'y', main: yfile }
  ]).bundle(function (err, src) {
    if (err) throw err;
    b.emit('__common', src);
    setTimeout(function () {
      fs.writeFile(xfile, "console.log(333)");
    }, 500);
  });

  b.on('update', function (ids) {
    b.bundle(function (err, src) {
      if (err) throw err;
      i++;
      b.emit('__common', src);
      setTimeout(function () {
        b.close();
      }, 50);
    });
  });

  function check (id) {
    return concat(function (src) {
      b.once('__common', function (common) {
        var src2 = Buffer.concat([common, src]);
        if (i === 0) {
          t.throws(run.bind(null, src));
          t.equal(run(src2), id === 'x' ? 556 : 557);
        } else {
          t.doesNotThrow(run.bind(null, src));
          if (id === 'x') {
            t.equal(run(src), 333);
          } else {
            t.equal(run(src2), 557);
          }
        }
      });
    });
  }
});

function run (src) {
  var output;
  var ctx = { console: { log: function (n) { output = n } } };
  vm.runInNewContext(src, ctx);
  return output;
}
