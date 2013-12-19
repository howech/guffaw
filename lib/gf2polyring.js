
var ringstuff = require('./ring')
var Ring = ringstuff.Ring
var RingMember = ringstuff.RingMember
var b64 = require('./base64')

function coefsFromElements(elements) {
    var c = [];
    
    for(var i=0; i<elements.length; ++i) {
	var e = elements[i];
	var m = e % 32, n = (e-m) >>> 5;
	c[n] ^= 1<<m
    }

    return c;
}

var GF2PolyRing = function() {
    this.name = "gf2p"
}

GF2PolyRing.prototype = new Ring()

var gf2polyring_single = new GF2PolyRing()

var GF2PolyRingMember = function(options) {
    this.ring = gf2polyring_single

    var coefs = []
    if(options instanceof Array) {
	coefs = options.slice(0)
    } else if(options) {
	if(options.elements) {
	    coefs = coefsFromElements(options.elements)
	} else if (options.coefs) { 
	    coefs = options.coefs.slice(0)
	}
    }

    this.coefs = coefs
    this.order = -1
    this.normalize()
}
GF2PolyRing.prototype.member = GF2PolyRingMember

GF2PolyRingMember.prototype = new RingMember()
GF2PolyRingMember.prototype.ring = gf2polyring_single

GF2PolyRing.prototype.parse = function(s) {
    var c

    c = b64.decode(s)

    return new this.member(c)
}

GF2PolyRing.prototype.encodeInt = function(i) {
    return new this.member([i])
}

GF2PolyRing.prototype.encodeString = function(s) {
    var c = []

    for(var i=0; i<s.length; ++i) {
	var k = i % 4
	var j = (i-k) >>> 2;
	var cd = s.charCodeAt(i)
	
	if(cd > 255 || cd < 0) 
	    throw "ascii only"

	c[j] |= (cd&255) << (k*8)
    }
    
    return new this.member(c)
}

GF2PolyRingMember.prototype.decodeInt = function() {
    if(this.order > 31)
	throw "out of range"

    return this.coefs[0] || 0
}

GF2PolyRingMember.prototype.decodeString = function() {
    var chars = []

    for(var i=0; i< this.coefs.length; ++i) {
	for(var j=0; j<4; ++j) {
	    var c = (this.coefs[i] >>> (j*8)) & 255
	    if(c) {
		chars.push( String.fromCharCode( c ) )
	    }
	}
    }
    
    return chars.join("")
}

    
GF2PolyRingMember.prototype.normalize = function() {
    if(this.normalized) {
	return
    }
    
    this.normalized = true

    var i = this.coefs.length

    while(i>0 && !this.coefs[i-1]) {
	--i;
    }

    this.coefs.splice(i)
    if(this.coefs.length > 0) {
	var x = this.coefs[this.coefs.length - 1]
	var j = 31
	while(j>0 && !(x&(1<<j))) {
	    --j
	}
	this.order = (this.coefs.length - 1)*32 + j
	
	for(j=0; j<this.coefs.length; ++j) {
	    // force all of the coefs to be 32bit integers
	    this.coefs[j] = ~~this.coefs[j]
	}
    } else {
	this.order = -1
    }
}

GF2PolyRingMember.prototype.add = function(b) {
    var ac = this.coefs, bc = b.coefs,
        l = Math.max(ac.length, bc.length),
        c = [];

    for(var i = 0; i<l; ++i) {
	c[i] = ac[i] ^ bc[i]
    }
    
    return this.another(c)
}

GF2PolyRingMember.prototype.equals = function(b) {
    var ac = this.coefs, bc = b.coefs,
        l = Math.max(ac.length, bc.length),
        c = [];

    for(var i = 0; i<l; ++i) {
	if( ac[i] ^ bc[i] ) {
	    return false
	}
    }

    return true
}

GF2PolyRingMember.prototype.add_inverse = function() {
    return this
}

GF2PolyRingMember.prototype.subtract = GF2PolyRingMember.prototype.add

GF2PolyRingMember.prototype.shift = function(n) {
    var p = n % 32, q = (n-p) >>> 5;

    var down=0, here=0;
    var c = []

    for(var i=0; i<this.coefs.length; ++i) {
	here = this.coefs[i]
	c[i+q] = (this.coefs[i] << p) ^ down
	if(p>0) {
	    down = here >>> (32-p)
	} else {
	    down = 0
	}
    }

    c[i+q] = down

    return this.another(c)
}    

GF2PolyRingMember.prototype.toString = function() {
    var i = 0, j = 1;
    
    var elements = [];

    for(i=0;i<this.coefs.length; ++i) {
	for(j=0;j<32;++j) {
	    if (this.coefs[i] & (1<<j)) {
		elements.push(i*32+j)
	    }
	}
    }

    return "[" + elements.join(" ") + "] " + this.order;
}

GF2PolyRingMember.prototype.toHex = function() {
    return b64.encode(this.coefs)
}

GF2PolyRingMember.prototype.ints = function() {
    var i = 0, j = 0;
    
    var elements = [];

    for(i=0;i<this.coefs.length; ++i) {
	for(j=0;j<32;++j) {
	    if (this.coefs[i] & (1<<j)) {
		elements.push(i*32+j)
	    }
	}
    }

    return elements;
}    

GF2PolyRingMember.prototype.multiply = function(b) {
    var c = [];
    var d = this

    var sh = 0;
    var elements = b.ints();
    
    for(var i=0; i<elements.length; ++i) {
	d = d.shift(elements[i]-sh)
	sh = elements[i]
	for(var j=0; j<d.coefs.length; ++j) {
	    c[j] ^= d.coefs[j]
	}
    }
    
    return this.another(c)
}

GF2PolyRingMember.prototype.square = function() {
    var c = [];
    
    var elements = this.ints();
    for(var i=0; i<elements.length; ++i) {
	var e = elements[i] * 2;
	var m = e %32, n = (e-m) >>> 5;
	
	c[n] ^= 1<<m
    }

    return this.another(c)
}

GF2PolyRing.prototype.one  = new GF2PolyRingMember([1])
GF2PolyRing.prototype.zero = new GF2PolyRingMember([0])

GF2PolyRingMember.prototype.isZero = function() {
    return this.order == -1
}

GF2PolyRingMember.prototype.divmod = function(b) {
    // returns {div: q, mod: r} st b * q + r = this

    if(b.isZero())
	throw "Divide by zero!"

    var one = this.ring.one

    var r = this
    var q = this.ring.zero

    while(r.order >= b.order) {
	var sh = r.order - b.order
	var n = one.shift(sh)
	var m = b.shift(sh)

	q = q.add(n)
	r = r.add(m)	
    }    

    return {div: q, mod: r}
}


function factors(n) {
    var primes = [2,3,5,7,11,13,17,23,29,31,37,41,43,47,
		  53,59,61,67,71,73,79,83,89,91,97];
    var factors = []

    for(var i=0;i<primes.length;++i) {
	var p = primes[i]
	if(p > n)
	    break;
	if(n % p == 0) {
	    factors.push(p)
	    while( n % p == 0 ) {
		n = n / p
	    }
	}
    }

    if ( n > 1 ) {
	factors.push(n)
    }

    return factors
}

GF2PolyRing.prototype.random = function(o) {
    var elements = []
    for(var i=0; i<o ;++i) {
	if(Math.random()>0.5) {
	    elements.push(i)
	}
    }
    return new this.member({elements: elements})
}

GF2PolyRingMember.rabin = function(f) {
    var q = f.order + 1
    var x = this.ring.one.shift(1)
    var one = this.ring.one
    var xqn = x
    var qn = 1

    var primes = factors(q)

    for(var i=primes.length-1;  i>=0; --i) {
	var ni = q / primes[i]

	if(ni==1) {
	    break;
	}
	
	while(qn < ni) {
	    qn++
	    xqn = xqn.square().mod(f)
	}

	var test = xqn.add(x).gcd(f)
	if( !test.add(one).isZero() ) {
	    return false
	}
    }

    while(qn < q) {
	qn++;
	xqn = xqn.square().mod(f)
    }
    
    return xqn.add(x).isZero()
}


exports.GF2PolyRing = GF2PolyRing
