var Reader = require('../lib/reader');
var Readable = require('stream').Readable;
var test = require('tape');
var concat = require('concat-stream');

test('reader', function (t) {
  t.plan(5);
  var reader = new Reader();
  reader.queue(rs());
  reader.queue(__dirname + '/read-manifests/y.json');
  reader.queue({ name: 'z', main: __dirname + '/read-manifests/z.js' });
  reader.on('end', function (res) {
    t.equal(res.length, 3);
    res = res.reduce(function (acc, x) {
      acc[x.name] = x;
      return acc;
    }, {});
    t.equal(res.z.expose, 'z');
    t.equal(res.y.main, __dirname + '/read-manifests/y.js');
    t.equal(res.x.name, 'x');
    t.ok(res.x._entry && 'function' === typeof res.x._entry.pipe);
  });
  reader.end();
});

function rs () {
  var s = Readable({ objectMode: true });
  s._read = function () {
    s.push({ 
      name: 'x',
      main: __dirname + '/read-manifests/x.js'
    });
    s.push(null);
  };
  return s;
}