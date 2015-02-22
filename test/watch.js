var test = require('tape');
var bant = require('..');
var os = require('os');
var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var vm = require('vm');

var tmpdir = path.join((os.tmpdir || os.tmpDir)(), 'bant-' + Math.random());
var xfile = path.join(tmpdir, 'x.js');

mkdirp.sync(tmpdir);
fs.writeFileSync(xfile, 'console.log(555);');

test('watch', function (t) {
  t.plan(4);
  var b = bant.watch(xfile);
  
  b.bundle(function (err, src) {
    if (err) throw err;
    t.equal(run(src), 555);
    fs.writeFile(xfile, 'console.log(666);');
  });

  b.on('update', function (ids) {
    t.equal(ids[0], xfile);
    b.bundle(function (err, src) {
      if (err) throw err;
      t.equal(run(src), 666);
      setTimeout(function () {
        t.ok(1);
        b.close();
      }, 10);
    });
  });
});

function run (src) {
  var output;
  function log (n) { output = n; }
  vm.runInNewContext(src, { console: { log: log } });
  return output;
}
