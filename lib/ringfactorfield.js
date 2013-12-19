var irr = [ [8,4,3,2,0],
	    [1024,19,6,1,0],
	    [1127,27,0] ]

var fstuff = require('./field')
var Field = fstuff.Field
var FieldMember = fstuff.FieldMember

var RingFactorField = function(ring, factor) {
    this.ring = ring
    this.factor = factor
    this.zero = new RingFactorFieldMember(this, ring.zero)
    this.one = new RingFactorFieldMember(this, ring.one)
    this.name = ring.name + "/" + (factor.toString())
}

exports.RingFactorField = RingFactorField

var RingFactorFieldMember = function(field, value) {
    this.field = field
    this.value = value
    this.normalize()
}

RingFactorField.prototype = new Field()
RingFactorField.prototype.member = RingFactorFieldMember
RingFactorField.prototype.parse = function(s) {
    var value = this.ring.parse(s)
    return new this.member(this,value)
}

RingFactorField.prototype.random = function() {
    var value = this.ring.random(this.factor.order)
    return new this.member(this, value)
}


RingFactorField.prototype.encodeInt = function(i) {
    var value = this.ring.encodeInt(i)
    return new this.member(this,value)
}

RingFactorField.prototype.encodeString = function(s) {
    var value = this.ring.encodeString(s)
    return new this.member(this,value)
}


RingFactorFieldMember.prototype = new FieldMember()

RingFactorFieldMember.prototype.normalize = function() {
    this.value = this.value.mod(this.field.factor)
}


RingFactorFieldMember.prototype.decodeInt = function() {
    return this.value.decodeInt()
}

RingFactorFieldMember.prototype.decodeString = function() {
    return this.value.decodeString()
}

RingFactorFieldMember.prototype.another = function(value) {
    return new this.field.member(this.field, value)
}

RingFactorFieldMember.prototype.add = function(b) {
    return this.another( this.value.add(b.value) )
}

RingFactorFieldMember.prototype.multiply = function(b) {
    return this.another( this.value.multiply(b.value) )
}

RingFactorFieldMember.prototype.shift = function(n) {
    return this.another( this.value.shift(n) )
}

RingFactorFieldMember.prototype.isZero = function() {
    return this.value.isZero()
}

RingFactorFieldMember.prototype.square = function() {
    return this.another(this.value.square())
}

RingFactorFieldMember.prototype.equals = function(b) {
    return this.value.equals(b.value)
}


RingFactorFieldMember.prototype.add_inverse = function() {
    return this
}


RingFactorFieldMember.prototype.mult_inverse = function() {
    var t = this.field.ring.zero,
        t1 = this.field.ring.one,
        r = this.field.factor,
        r1 = this.value

    while(!r1.isZero()) {
	var q = r.div(r1)
	var temp
	temp = r1
	r1 = r.subtract(q.multiply(r1))
	r = temp
	temp = t1
	t1 = t.subtract(q.multiply(t1))
	t = temp
    }
    return this.another(t)
}

RingFactorFieldMember.prototype.toString = function() {
    return this.value.toString()
}
RingFactorFieldMember.prototype.toHex = function() {
    return this.value.toHex()
}
