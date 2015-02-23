var bant = require('..');
var test = require('tape');
var fs = require('fs');
var vm = require('vm');

test('globals', function (t) {
  t.plan(6);
  bant({ factor: false, globals: { qux: 'quux' } }).use([
    { main: __dirname + '/globals/x.js', name: 'x', globals: { foo: 'bar' }  },
    { main: __dirname + '/globals/y.js', name: 'y', globals: { bar: 'baz' }  }
  ]).bundle(function (err, src) {
    if (err) throw err;
    vm.runInNewContext(src, { t: t });
  });
});