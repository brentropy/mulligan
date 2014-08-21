/* jshint expr: true */

var mulligan = require('./index')
var should = require('should')
var sinon = require('sinon')

describe('The mulligan function', function () {
  
  it('should call `resolve` with `val` when resolved', function () {
    var val = 47
    var resolver = sinon.stub().callsArgWith(0, val)
    var resolve = sinon.spy()
    var reject = sinon.spy()
    mulligan(1, 0, resolver)(resolve, reject)
    resolve.called.should.be.true
    reject.called.should.be.false
    resolve.calledWith(val).should.be.true
  })

  it('should call `reject` with `err` when rejected', function () {
    var err = new Error('Oh snap!')
    var resolver = sinon.stub().callsArgWith(1, err)
    var resolve = sinon.spy()
    var reject = sinon.spy()
    mulligan(1, 0, resolver)(resolve, reject)
    resolve.called.should.be.false
    reject.called.should.be.true
    reject.calledWith(err).should.be.true
  })
  
  it('should call `resolver` up to `count` number of times', function (done) {
    var count = 5
    var err = new Error('Oh snap!')
    var resolver = sinon.stub().callsArgWith(1, err)
    mulligan(count, 1, resolver)(null, function (actualErr) {
      resolver.callCount.should.equal(count)
      actualErr.should.equal(err)
      done()
    })
  })

  it('should call `resolver` once if resolved first time', function (done) {
    var val = 47
    var resolver = sinon.stub().callsArgWith(0, val)
    mulligan(5, 1, resolver)(function (actualVal) {
      resolver.callCount.should.equal(1)
      actualVal.should.equal(val)
      done()
    })
  })

  it('should retry `resolver`after `wait` seconds', function () {
    var clock = sinon.useFakeTimers()
    var err = new Error('Oh snap!')
    var resolver = sinon.stub().callsArgWith(1, err)
    var wait = 2
    mulligan(2, wait, resolver)(null, function() {})
    clock.tick(wait - 1)
    resolver.callCount.should.equal(1)
    clock.tick(1)
    resolver.callCount.should.equal(2)
    clock.restore()
  })

  it('should reject without retry if `cond` returns `false`', function (done) {
    var err = new Error('Oh snap!')
    var resolver = sinon.stub().callsArgWith(1, err)
    var cond = function() { return false }
    mulligan(2, 1, resolver, cond)(null, function (actualErr) {
      resolver.callCount.should.equal(1)
      done()
    })
  })
  
  it('should retry if `cond` returns `true`', function (done) {
    var err = new Error('Oh snap!')
    var count = 2
    var resolver = sinon.stub().callsArgWith(1, err)
    var cond = function() { return true }
    mulligan(count, 1, resolver, cond)(null, function (actualErr) {
      resolver.callCount.should.equal(count)
      done()
    })
  })

  it('should call `cond` with the `err` for each rejection', function (done) {
    var err = new Error('Oh snap!')
    var count = 2
    var resolver = sinon.stub().callsArgWith(1, err)
    var cond = sinon.stub().returns(true)
    mulligan(count, 1, resolver, cond)(null, function (actualErr) {
      resolver.callCount.should.equal(count)
      cond.alwaysCalledWith(err)
      done()
    })
  })
})

