#!/usr/bin/env node

var yargs = require('yargs')

  .usage('usage: $0 [entry files] [options]')
  .help('help')
  .version(require('../package.json').version + '\n', 'version')

  .alias('help', 'h')
  .alias('version', 'V')
  .alias('component', 'c')
  .alias('outfile', 'o')

  .string('outfile')

  .describe('help', 'show this message')
  .describe('version', 'show version number')
  .describe('outfile', '<filename> output file name')
  .describe('component', 'build with component');

// TODO: group options by builder

if (!yargs.argv._.length && !yargs.argv.component) {
  yargs.showHelp();
  process.exit(1);
}

var fs = require('fs');
var path = require('path');
var bant = require('..');

var argv = yargs.argv, opts;

function output (err, res) {
  if (err) throw err;

  if (argv.outfile)
    fs.writeFileSync(path.resolve(process.cwd(), argv.outfile), res);
  else
    process.stdout.write(res);
}

if (argv.component) {

  opts = {
    install: true, verbose: true
  };

  bant.component(process.cwd(), opts, output);

} else {

  opts = {
    extensions: ['.coffee', '.js', '.json']
  };

  var files = argv._.map(function (i) {
    return path.resolve(process.cwd(), i);
  });

  bant.browserify(files, opts, output);

}
