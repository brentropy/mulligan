# Mulligan

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

Mulligan takes function an optional fourth argument to support conditional
retries. It receives the `error` from the last rejection. If the function
returns `true` it will move on the the next attempt. If the function returns
`false` the promise will be rejected immediately.
