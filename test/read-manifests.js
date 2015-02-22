var bant = require('..');
var test = require('tape');
var fs = require('fs');
var vm = require('vm');

test('read manifests', function (t) {
  t.plan(3);
  bant({ 
    basedir: __dirname + '/read-manifests',
    factor: false
  }).use([
    { main: __dirname + '/read-manifests/x.js', name: 'x' },
    __dirname + '/read-manifests/y.json',
    fs.createReadStream(__dirname + '/read-manifests/z.json')
  ]).bundle(function (err, src) {
    if (err) throw err;
    var expected = { x: 555, y: 666, z: 777 };
    var ctx = {
      console: { log: function (name, n) { t.equal(expected[name], n) } }
    };
    vm.runInNewContext(src, ctx);
  });
});