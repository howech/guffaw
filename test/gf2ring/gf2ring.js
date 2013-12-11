var buster = require('buster')
var gf2stuff = require('../../lib/gf2polyring')
var GF2PolyRing = gf2stuff.GF2PolyRing
var GF2PolyRingMember = gf2stuff.GF2PolyRingMember

var assert = buster.referee.assert
var refute = buster.referee.refute

var zero = GF2PolyRing.prototype.zero
var one  = GF2PolyRing.prototype.one
var two = GF2PolyRing.prototype.one.shift(1)

buster.testCase("Zero and one properties", {
    'test zero is zero': function() {
	assert(zero.isZero())
	assert(zero.add(zero).isZero())
	assert(zero.multiply(zero).isZero())
	assert.equals(zero.order,-1)
	assert(zero.equals(zero))
	assert(zero.square().isZero())
    },

    'test one has one properties': function() {
	assert.equals(one.order, 0)
	assert(one.equals(one))
	refute(one.equals(zero))
	assert(one.add(one).isZero())
	assert(one.multiply(one).equals(one))
	assert(one.gcd(one).equals(one))
	assert(one.gcd(zero).equals(one))
	assert(zero.gcd(one).equals(one))
	assert(zero.div(one).equals(zero))
	assert(one.div(one).equals(one))
	assert(zero.mod(one).equals(zero))
	assert(one.mod(one).equals(zero))
	assert(one.square().equals(one))
    },

    'test two and three properties': function() {
	assert.equals(two.order, 1)
	assert(two.add(zero).equals(two))
	var three = two.add(one)

	refute(three.equals(one))
	refute(three.equals(two))
	refute(three.equals(zero))
	assert.equals(three.order,1)
	assert(two.add(two).isZero())
	assert(two.add(three).equals(one))
	assert(three.add(three).isZero())
	assert(three.add(one).equals(two))

	assert(two.mod(three).equals(one))
	assert(three.mod(two).equals(one))

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

	
	var z = x.gcd(y)
	assert( x.mod(z).isZero())
	assert( y.mod(z).isZero())

	assert( x.mod(z).isZero() )
	assert( y.mod(z).isZero() )
    },


    'taste failure' : function() {
	assert(false)
    }
})
