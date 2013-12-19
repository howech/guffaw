var rings = require('./ring')

var FieldPolyRing = function(field) {
    this.field = field
    this.zero = new this.member(this, [field.zero])
    this.one  = new this.member(this, [field.one])
    this.name = "polynomial over " + this.field.name
}

var FieldPolyRingMember = function(ring, values) {
    this.ring = ring
    this.field = ring.field
    if(values) {
	this.values = values.slice(0)
    } else {
	this.values = [this.field.zero]
    }
    this.order = -1
    this.normalize()
}

FieldPolyRing.prototype = new rings.Ring()
FieldPolyRingMember.prototype = new rings.RingMember()
exports.FieldPolyRing = FieldPolyRing

FieldPolyRing.prototype.member = FieldPolyRingMember

FieldPolyRingMember.prototype.another = function(values) {
    return new this.ring.member(this.ring, values)
}


FieldPolyRingMember.prototype.normalize = function() {
    var highest_non_zero = this.values.length -1

    while(highest_non_zero >= 0 && this.values[highest_non_zero].isZero()) {
	highest_non_zero--;
    }

    this.values.splice(highest_non_zero+1);
    this.order = highest_non_zero

    for(var i=0;i<this.values.length;++i) {
	if(!this.values[i])
	    this.values[i] = this.field.zero
    }
}

FieldPolyRingMember.prototype.add = function(b) {
    if(this.type() != b.type())
	undefined.x = 7
    
    var ac = this.values, bc = b.values,
        l = Math.max(ac.length, bc.length),
        c = [];

    for(var i = 0; i<l; ++i) {
	var av = ac[i] || this.field.zero
	var bv = bc[i] || this.field.zero

	c[i] = av.add(bv)
    }
    
    return this.another(c)
}

FieldPolyRingMember.prototype.equals = function(b) {
    var ac = this.values, bc = b.values,
        l = Math.max(ac.length, bc.length);

    if(this.order != b.order)
	return false

    for(var i = 0; i<l; ++i) {
	var av = ac[i] || this.field.zero
	var bv = bc[i] || this.field.zero
	if(!av.equals(bv))
	    return false
    }

    return true
}

FieldPolyRingMember.prototype.add_inverse = function() {
    var c = []
    
    for(var i=0; i<this.values.length; ++i) {
	c[i] = this.values[i].add_inverse()
    }

    return this.another(c)
}

FieldPolyRingMember.prototype.shift = function(n) {
    var c = []
    for(var i=0;i<n;++i)
	c[i] = this.field.zero

    for(var i=0; i<this.values.length; ++i) {
	c[i+n] = this.values[i]
    }

    return this.another(c)
}

FieldPolyRingMember.prototype.mult_const = function(m) {
    var c = []
    for(var i=0; i<this.values.length; ++i) {
	c[i] = this.values[i].multiply(m)
    }
    return this.another(c)
}

FieldPolyRingMember.prototype.eval = function(x) {
    var result = this.field.zero

    for(var i=this.values.length-1; i>=0; --i) {
	result = result.multiply(x).add(this.values[i])
    }
    
    return result
}


FieldPolyRingMember.prototype.toString = function() {
    var strs = []
    for(var i=0;i<this.values.length;++i) {
	strs[i] = this.values[i].toString()
    }

    return "[ " + strs.join(", ") + " ]"
}

FieldPolyRingMember.prototype.toHex = function() {
    var strs = []
    for(var i=0;i<this.values.length;++i) {
	strs[i] = this.values[i].toHex()
    }

    return "[ " + strs.join(", ") + " ]"
}

FieldPolyRingMember.prototype.multiply = function(b) {
    var result = this.ring.zero
    

    for(var i=0; i<b.values.length; ++i) {
	if(! b.values[i].isZero()) {
	    result = result.add( this.mult_const(b.values[i] ).shift(i))
	}
	
    }
	
    return result
}

FieldPolyRingMember.prototype.top = function() {
    if(this.order < 0) {
	return this.field.zero
    }

    return this.values[this.order]
}

FieldPolyRingMember.prototype.isZero = function() {
    return (this.order == -1)
}

FieldPolyRingMember.prototype.divmod = function(b) {
    // q * b + r = this

    var r = this
    var q = this.ring.zero
    var one = this.ring.one

    var btopinv = b.top().mult_inverse()

    while(r.order >= b.order) {
	var sh = r.order - b.order
	var c = r.top().multiply(btopinv)
	var n = one.shift(sh).mult_const(c)
	var m = b.shift(sh).mult_const(c)

	q = q.add(n)
	r = r.subtract(m)
    }

    return {div: q, mod: r}
}

FieldPolyRingMember.prototype.mod= function (b) {
    return this.divmod(b).mod
}

FieldPolyRingMember.prototype.div= function(b) {
    return this.divmod(b).div
}

FieldPolyRing.prototype.interpolate = function(x,y) {
    var result = this.zero
    var numerator 
    var denominator 

    var ex = this.one.shift(1)

    for(var i=0;i<x.length;++i) {
	numerator = this.one
	denominator = this.field.one
	for(var j=0; j<x.length; ++j) {
	    if(i!=j) {
		numerator = numerator.multiply(ex.subtract(this.one.mult_const(x[j])))
		denominator = denominator.multiply(x[j].subtract(x[i]))
	    }
	}

	var c = y[i].multiply(denominator.mult_inverse())
	result = result.add( numerator.mult_const(c)) 
    }
    
    return result    

}
