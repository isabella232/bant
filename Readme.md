# bant

package-manager agnostic build tool for modular web applications

## install

With [npm](http://npmjs.org/) do:

```sh
npm i bant -g
```

## usage

```
usage: bant [entry files] [options]

Options:
  --help, -h       show this message
  --version, -V    show version number
  --outfile, -o    <filename> output file name
  --component, -c  build with component
```

## api

### bant.browserify(files=[], opts={}, cb)

See [browserify](http://github.com/substack/node-browserify) for available `opts`

### bant.component(component, opts={}, cb)

See [component-resolver](http://github.com/componentjs/resolver.js) for available `opts`

## license

The MIT License (MIT)

Copyright (c) 2014 Onur Gunduz ogunduz@gmail.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
