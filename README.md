# Mulligan

[![npm](http://img.shields.io/npm/v/mulligan.svg?style=flat)](https://www.npmjs.org/package/mulligan)
[![Travis](http://img.shields.io/travis/brentburgoyne/mulligan.svg?style=flat)](https://travis-ci.org/brentburgoyne/mulligan)
[![Code Climate](http://img.shields.io/codeclimate/github/brentburgoyne/mulligan.svg?style=flat)](https://codeclimate.com/github/brentburgoyne/mulligan)
[![Code Climate Coverage](http://img.shields.io/codeclimate/coverage/github/brentburgoyne/mulligan.svg?style=flat)](https://codeclimate.com/github/brentburgoyne/mulligan)

A simple JavaScript helper for adding a retry interval for rejected promises.

## Installation

```bash
$ npm install mulligan --save
```

## Usage

Mulligan works with any promise library that implements an ES6 style promise
constructor. It works by wrapping a resolver function.

```js
var Promise = require('any-supported-promise-library')
var mulligan = require('mulligan')

var promise = new Promise(mulligan(
  5, // the number of times to try before rejecting
  1000, // the number of milliseconds to wait between retries
  function (resolve, reject) {} // promise resolver
))
```

## Conditional Retries

Mulligan takes a function as an optional fourth argument to support conditional
retries. It receives the `error` from the last rejection as the first argument.
If the function returns `true` it will move on the the next attempt. If the 
function returns `false` the promise will be rejected immediately.
