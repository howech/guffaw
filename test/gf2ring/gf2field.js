var buster = require('buster')
var RingFactorField = require('../../lib/ringfactorfield').RingFactorField
var RingFactorFieldMember = RingFactorField.prototype.member

var GF2PolyRing = require('../../lib/gf2polyring').GF2PolyRing

var assert = buster.referee.assert
var refute = buster.referee.refute

var ring = new GF2PolyRing()
//var field = new RingFactorField(ring, new ring.member({'elements': [8,4,3,2,0]}))
var field = new RingFactorField(ring, new ring.member({'elements': [1127,27,0]}))
 
var zero = field.zero
var one  = field.one
var two  = one.shift(1)

buster.testCase("Zero and one properties", {
    'test zero is zero': function() {
	assert(zero.isZero())
	assert(zero.add(zero).isZero())
	assert(zero.multiply(zero).isZero())
	assert(zero.equals(zero))
	assert(zero.square().isZero())
    },

    'test one has one properties': function() {
	assert(one.equals(one))
	refute(one.equals(zero))
	assert(one.add(one).isZero())
	assert(one.multiply(one).equals(one))
	assert(one.square().equals(one))
    },

    'test two and three properties': function() {
	assert(two.add(zero).equals(two))
	var three = two.add(one)

	refute(three.equals(one))
	refute(three.equals(two))
	refute(three.equals(zero))
	assert(two.add(two).isZero())
	assert(two.add(three).equals(one))
	assert(three.add(three).isZero())
	assert(three.add(one).equals(two))

	var x = two.multiply(two).multiply(two).multiply(three)
	var xx = two.multiply(two).multiply(three).multiply(two)
	var xxx = two.multiply(three).multiply(two).multiply(two)
	assert(x.equals(xx),"x=xx")
	assert(x.equals(xxx),"x=xxx")

	var y = two.multiply(two).multiply(three).multiply(three)
	var yy = two.multiply(three).multiply(three).multiply(two)
	var yyy = two.multiply(three).multiply(two).multiply(three)
	assert(y.equals(yy),"y=yy")
	assert(y.equals(yyy),"y=yyy")
	refute(x.equals(y))

	var half = two.mult_inverse()
	var third = three.mult_inverse()
	assert(one.equals(half.multiply(two)))
	assert(one.equals(two.multiply(half)))
	assert(one.equals(third.multiply(three)))
	assert(one.equals(three.multiply(third)))

    },

    'taste failure' : function() {
	assert(false)
    }
})
