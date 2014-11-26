
var test = require('tap').test;
var bant = require('..');
var vm = require('vm');

test('js-relative', function (t) {
  t.plan(2);

  function cb (err, res) {
    vm.runInNewContext(res, {
      console: { log: log }
    });
    function log (res) { t.equal(res, 'foo'); }
  }

  bant.browserify(__dirname + '/js-relative/a.js', {}, cb);

  bant.component({ scripts: ['a.js', 'b.js'] }, 
    { root: __dirname + '/js-relative' }, cb);

});
