var buster = require('buster')
var assert = buster.referee.assert
var refute = buster.referee.refute

var RingFactorField = require('../../lib/ringfactorfield').RingFactorField
var RingFactorFieldMember = RingFactorField.prototype.member

var GF2PolyRing = require('../../lib/gf2polyring').GF2PolyRing

var assert = buster.referee.assert
var refute = buster.referee.refute

var ring0 = new GF2PolyRing()
//var field = new RingFactorField(ring0, new ring0.member({'elements': [8,4,3,2,0]}))
var field = new RingFactorField(ring0, new ring0.member({'elements': [1127,27,0]}))
var FieldPolyRing = require('../../lib/fieldring').FieldPolyRing

var ring = new FieldPolyRing(field)
var zero = ring.zero
var one  = ring.one
var two = ring.one.shift(1)

buster.testCase("Zero and one properties", {
    'test zero is zero': function() {
	assert(zero.isZero(),"zero is zero")
	assert(zero.add(zero).isZero(),"zero plus zero is zero")
	assert(zero.multiply(zero).isZero(),"zero times zero is zero")
	assert.equals(zero.order,-1,"zero order is -1")
	assert(zero.equals(zero),"zero equals zero")
	assert(zero.square().isZero(),"zero sqared is zero")
    },

    'test one has one properties': function() {
	assert.equals(one.order, 0,"one order zero")
	assert(one.equals(one),"one equals one")
	refute(one.equals(zero),"one not equal zero")
	assert(one.add(one).isZero(),"one plus one is zero")
	assert(one.multiply(one).equals(one),"one times one is one")
	assert(one.gcd(one).equals(one), "one gcd one is one")
	assert(one.gcd(zero).equals(one), "one gcd zero is one")
	assert(zero.gcd(one).equals(one), "zero gcd one is one")
	assert(zero.div(one).equals(zero), "zero div one is zero")
	assert(one.div(one).equals(one), "one div one is one")
	assert(zero.mod(one).equals(zero), "zero mod one is zero")
	assert(one.mod(one).equals(zero), "one mod one is zero")
	assert(one.square().equals(one), "one squared is one")
    },

    'test two and three properties': function() {
	assert.equals(two.order, 1)
	assert(two.add(ring.zero).equals(two),"a")
	var three = two.add(one)

	refute(three.equals(one),"b")
	refute(three.equals(two),"c")
	refute(three.equals(zero),"d")
	assert.equals(three.order,1,"three")
	assert(two.add(two).isZero(),"e")
	assert(two.add(three).equals(one),"f")
	assert(three.add(three).isZero(),"g")
	assert(three.add(one).equals(two),"g")

	assert(two.mod(three).equals(one),"i")
	assert(three.mod(two).equals(one),"j")

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


    'interpolation test': function() {
	var two = field.one.shift(1)
	var x = [field.zero, field.one, two]
	var y = [field.one, field.zero, two]
	
	var poly = ring.interpolate(x,y)
	assert( field.one.equals( poly.eval( field.zero ) ), "val at zero" )
	assert( field.zero.equals( poly.eval( field.one ) ), "val at one" )
	assert( two.equals( poly.eval( two ) ), "val at two" )

    },

    'taste failure' : function() {
	assert(false)
    }
})
