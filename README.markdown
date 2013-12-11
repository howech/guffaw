
# guffaw

A GF(2^m) finite field implmentation, specifically targeted for shamir secret sharing

[![build status](https://secure.travis-ci.org/syranez/EDIT-repo-name.png)](http://travis-ci.org/syranez/EDIT-repo-name)

## Installation

`npm install guffaw`

... or to install the package globally:

`npm install -g guffaw`

## Usage

    var guffaw = request("guffaw");

    EDIT-show-usage-here

## Version scheme

The version scheme is this:

    {major-release}.{feature-release}.{bugfixes/maintaining}

 - Major release part

Changes that make your app crash if you update without modifying your code. The major release version is usally bumped if code structure changes happened, or something really exciting has happened. It breaks your stuff.

If you are using this module as dependency in live production apps, DO NOT wildcard this.

 - Feature release part

Introduces new features, that may work or not. You usually WANT this on development systems, but you DO NOT want this wildcarded in live production environments.

 - Bugfixes / maintaining part

Will be bumped everytime a bug is fixed or maintaining stuff (=all that does not break code, e. g. cosmetic code changes, comment stuff) has happend. You usually DO WANT bugs fixed on all your systems. Nothing is intended to break.

## License

(The Apache License, version 2.0)

Copyright (c) 2013 Chris Howe &lt;chris@mhoweville.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
