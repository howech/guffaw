var Ring = function(options) {
}

var RingMember = function(options) {
}

exports.Ring = Ring
exports.RingMember = RingMember


Ring.prototype.add = function(a,b) {
    return a.add(b)
}

Ring.prototype.subtract = function(a,b) {
    return a.subtract(b)
}

Ring.prototype.multiply = function(a,b) {
    return a.multiply(b)
}

Ring.prototype.divmod = function(a,b) {
    return a.divmod(b)
}

Ring.prototype.mod = function(a,b) {
    return a.mod(b)
}

Ring.prototype.div = function(a,b) {
    return a.div(b)
}

Ring.prototype.gcd = function(a,b) {
    return a.gcd(b)
}

Ring.prototype.square = function(a) {
    return a.square()
}

Ring.prototype.power = function(a,n) {
    return a.power(n)
}

Ring.prototype.equal = function(a,b) {
    return a.equals(b)
}


Ring.prototype.add_inverse = function(a) {
    return a.add_inverse()
}

RingMember.prototype.another = function(options) {
    return new this.ring.member(options)
}

RingMember.prototype.mod = function(b) {
    return this.divmod(b).mod
}

RingMember.prototype.div = function(b) {
    return this.divmod(b).div
}

RingMember.prototype.subtract = function(b) {
    return this.add( b.add_inverse() )
}

RingMember.prototype.sub = function(b) {
    return this.subtract(b)
}

RingMember.prototype.square = function() {
    return this.multiply(this)
}

RingMember.prototype.times = function(b) {
    return this.multiply(b)
}

RingMember.prototype.gcd = function(b) {
    d = this
    e = b

    if(d.isZero())
	return e;

    while(!e.isZero()) {
	var r = d.mod(e);
	d = e
	e = r
    }

    return d
}	


RingMember.prototype.power = function(p) {
    result = this.ring.one
    zn = this

    // z^(2n) = ( z^(n) )^2
    // z^(2n+1) = ( z^(n) ) ^2 * z

    while(p > 0) {
	if(p%2 == 1) {
	    result = result.multiply(zn);
	    p -= 1;
	}
	zn = zn.square()
	p = p / 2
    }
    
    return result;
}

