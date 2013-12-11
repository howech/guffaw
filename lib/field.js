var Field = function(options) {
}

var FieldMember = function(options) {
}

exports.Field = Field
exports.FieldMember = FieldMember


Field.prototype.add = function(a,b) {
    return a.add(b)
}

Field.prototype.subtract = function(a,b) {
    return a.subtract(b)
}

Field.prototype.multiply = function(a,b) {
    return a.multiply(b)
}


Field.prototype.divide = function(a,b) {
    return a.divide(b)
}

Field.prototype.div = function(a,b) {
    return a.divide(b)
}

Field.prototype.square = function(a) {
    return a.square()
}

Field.prototype.power = function(a,n) {
    return a.power(n)
}

Field.prototype.equal = function(a,b) {
    return a.equals(b)
}


Field.prototype.add_inverse = function(a) {
    return a.add_inverse()
}

Field.prototype.mult_inverse = function(a) {
    return a.mult_inverse()
}

FieldMember.prototype.another = function(options) {
    return new this.ring.member(options)
}

FieldMember.prototype.div = function(b) {
    return this.divide(b)
}

FieldMember.prototype.subtract = function(b) {
    return this.add( b.add_inverse() )
}

FieldMember.prototype.sub = function(b) {
    return this.subtract(b)
}

FieldMember.prototype.times = function(b) {
    return this.multiply(b)
}

FieldMember.prototype.power = function(p) {
    result = this.field.one
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

FieldMember.prototype.divide = function(b) {
    return this.multiply(b.mult_inverse())
}
