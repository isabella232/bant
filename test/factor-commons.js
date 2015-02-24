var bant = require('..');
var test = require('tape');
var vm = require('vm');
var concat = require('concat-stream');

test('factor', function (t) {
  t.plan(4);

  var b = bant({ 
    factor: true,
    outputs: {
      x: check(557),
      y: check(556)
    }
  });

  b.use([
    __dirname + '/factor-commons/x.json',
    __dirname + '/factor-commons/y.json'
  ]).bundle(function (err, src) {
    if (err) throw err;
    b.emit('bant-test-common', src);
  });

  function check (expected) {
    return concat(function (src) {
      b.on('bant-test-common', function (common) {
        t.throws(run.bind(null, src));
        t.equal(run(Buffer.concat([common, src])), expected);
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
